import ast
import re
from typing import List, Dict, Any

class StaticAnalyzer:
    """
    Advanced Multi-Language AST & Heuristic Bug & Security Scanner
    Detects critical runtime bugs, memory leaks, unhandled promise rejections,
    React hook anti-patterns, resource leaks, injection risks, and credential exposures.
    """

    def analyze_file(self, file_path: str, content: str) -> List[Dict[str, Any]]:
        issues = []
        ext = file_path.split('.')[-1].lower() if '.' in file_path else ''

        if ext == 'py':
            issues.extend(self._analyze_python(file_path, content))
        elif ext in ('java',):
            issues.extend(self._analyze_java(file_path, content))
        elif ext in ('js', 'jsx', 'ts', 'tsx'):
            issues.extend(self._analyze_javascript(file_path, content))
        elif ext in ('c', 'cpp', 'cc', 'h', 'hpp'):
            issues.extend(self._analyze_cpp(file_path, content))

        # Universal checks (secrets, hardcoded credentials, token leaks)
        issues.extend(self._analyze_universal_security(file_path, content))

        return issues

    def _analyze_python(self, file_path: str, content: str) -> List[Dict[str, Any]]:
        issues = []
        lines = content.split('\n')

        # AST-level deep inspection
        try:
            tree = ast.parse(content, filename=file_path)
            for node in ast.walk(tree):
                # 1. Bare except / broad exception
                if isinstance(node, ast.ExceptHandler):
                    if node.type is None or (isinstance(node.type, ast.Name) and node.type.id in ('Exception', 'BaseException')):
                        issues.append({
                            'type': 'quality',
                            'severity': 'MEDIUM',
                            'file_path': file_path,
                            'line_number': getattr(node, 'lineno', 1),
                            'title': 'Overly broad exception handling',
                            'description': 'Catching BaseException or broad Exception suppresses unexpected system exits, KeyboardInterrupt, or critical errors.',
                            'code_snippet': 'except Exception:',
                            'recommendation': 'Catch specific, expected exception classes instead of broad Exception.'
                        })

                # 2. Mutable default argument
                if isinstance(node, ast.FunctionDef):
                    for default in node.args.defaults:
                        if isinstance(default, (ast.List, ast.Dict, ast.Set)):
                            issues.append({
                                'type': 'bug',
                                'severity': 'HIGH',
                                'file_path': file_path,
                                'line_number': getattr(node, 'lineno', 1),
                                'title': f'Mutable default argument in function "{node.name}"',
                                'description': 'Default parameter value is a mutable collection evaluated once when the function is defined and shared across all invocations.',
                                'code_snippet': f'def {node.name}(..., param=[]):',
                                'recommendation': 'Use None as default argument and initialize the collection inside the function body.'
                            })

                # 3. SQL Injection pattern
                if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and node.func.attr == 'execute':
                    for arg in node.args:
                        if isinstance(arg, (ast.JoinedStr, ast.BinOp)):
                            issues.append({
                                'type': 'security',
                                'severity': 'CRITICAL',
                                'file_path': file_path,
                                'line_number': getattr(node, 'lineno', 1),
                                'title': 'Potential SQL Injection via string formatting',
                                'description': 'SQL query appears to be constructed using formatted strings or concatenation instead of parameterized queries.',
                                'code_snippet': 'cursor.execute(f"SELECT ... {user_input}")',
                                'recommendation': 'Use parameterized queries: cursor.execute("SELECT ... WHERE id = %s", (user_input,))'
                            })

                # 4. Insecure pickle / eval deserialization
                if isinstance(node, ast.Call):
                    func_name = ''
                    if isinstance(node.func, ast.Name):
                        func_name = node.func.id
                    elif isinstance(node.func, ast.Attribute):
                        func_name = node.func.attr

                    if func_name in ('eval', 'exec'):
                        issues.append({
                            'type': 'security',
                            'severity': 'CRITICAL',
                            'file_path': file_path,
                            'line_number': getattr(node, 'lineno', 1),
                            'title': f'Dangerous dynamic code execution via {func_name}()',
                            'description': f'Executing dynamic code via {func_name}() exposes the application to arbitrary code execution if inputs contain unescaped user data.',
                            'code_snippet': f'{func_name}(...)',
                            'recommendation': 'Refactor to eliminate dynamic string execution or use ast.literal_eval for safe literal evaluation.'
                        })

        except SyntaxError as e:
            issues.append({
                'type': 'bug',
                'severity': 'CRITICAL',
                'file_path': file_path,
                'line_number': e.lineno or 1,
                'title': f'Syntax error in Python script: {e.msg}',
                'description': f'Parser encountered an unparseable token: {e.text}',
                'code_snippet': (e.text or '').strip(),
                'recommendation': 'Fix the syntax error to ensure valid compilation.'
            })
        except Exception:
            pass

        # Line-by-line heuristic patterns
        for idx, line in enumerate(lines, start=1):
            stripped = line.strip()
            # File opened without 'with'
            if re.search(r'\b[a-zA-Z0-9_]+\s*=\s*open\(', stripped) and 'with ' not in stripped:
                issues.append({
                    'type': 'bug',
                    'severity': 'HIGH',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Unmanaged file handle (resource leak risk)',
                    'description': 'Opening files without a "with" context manager leaves file descriptors open if an exception occurs prior to close().',
                    'code_snippet': stripped,
                    'recommendation': 'Wrap file operations inside a context manager: "with open(...) as f:".'
                })

            # CORS wildcard with credentials
            if 'allow_origins=["*"]' in stripped.replace(" ", "") and 'allow_credentials=True' in content:
                issues.append({
                    'type': 'security',
                    'severity': 'CRITICAL',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Permissive CORS wildcard with credentials enabled',
                    'description': 'Configuring allow_origins=["*"] with allow_credentials=True breaks browser origin isolation and violates CORS specifications.',
                    'code_snippet': stripped,
                    'recommendation': 'Specify exact trusted origin domains rather than wildcard "*".'
                })

        return issues

    def _analyze_javascript(self, file_path: str, content: str) -> List[Dict[str, Any]]:
        issues = []
        lines = content.split('\n')

        for idx, line in enumerate(lines, start=1):
            stripped = line.strip()

            # 1. dangerouslySetInnerHTML XSS
            if 'dangerouslySetInnerHTML' in stripped:
                issues.append({
                    'type': 'security',
                    'severity': 'CRITICAL',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Cross-Site Scripting (XSS) via dangerouslySetInnerHTML',
                    'description': 'Injecting unescaped raw HTML bypasses React DOM sanitization and allows malicious script payload execution.',
                    'code_snippet': stripped,
                    'recommendation': 'Sanitize input using DOMPurify.sanitize(...) before rendering.'
                })

            # 2. React useEffect async anti-pattern
            if re.search(r'useEffect\s*\(\s*async\s*\(', stripped):
                issues.append({
                    'type': 'bug',
                    'severity': 'HIGH',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Async callback directly in useEffect (React Anti-Pattern)',
                    'description': 'useEffect callbacks cannot be async functions because async functions return a Promise, causing React to treat the Promise as a cleanup function.',
                    'code_snippet': stripped,
                    'recommendation': 'Define an inner async function inside the effect and call it: useEffect(() => { const load = async () => { ... }; load(); }, []);'
                })

            # 3. Direct React State Mutation
            if re.search(r'\bstate\.[a-zA-Z0-9_]+\s*(\+\+|--|\+=|-=|=)', stripped) and not stripped.startswith('//'):
                issues.append({
                    'type': 'bug',
                    'severity': 'HIGH',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Direct state mutation bypassing setState',
                    'description': 'Mutating state directly prevents React from detecting changes, resulting in stale renders and UI synchronization bugs.',
                    'code_snippet': stripped,
                    'recommendation': 'Always use immutable state updates via setState() or dispatch().'
                })

            # 4. JSON.parse without try/catch
            if 'JSON.parse(' in stripped and 'try' not in line and not stripped.startswith('//'):
                # Check surrounding context
                start_ctx = max(0, idx - 4)
                surrounding = "\n".join(lines[start_ctx:idx])
                if 'try {' not in surrounding:
                    issues.append({
                        'type': 'bug',
                        'severity': 'MEDIUM',
                        'file_path': file_path,
                        'line_number': idx,
                        'title': 'Uncaught JSON.parse exception vulnerability',
                        'description': 'Calling JSON.parse() on malformed or empty payloads throws an unhandled SyntaxError that can crash the component tree.',
                        'code_snippet': stripped,
                        'recommendation': 'Wrap JSON.parse calls in a try/catch block with fallback value.'
                    })

            # 5. window.addEventListener without cleanup
            if 'addEventListener(' in stripped and 'removeEventListener' not in content:
                issues.append({
                    'type': 'performance',
                    'severity': 'MEDIUM',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Window event listener without cleanup (Memory Leak)',
                    'description': 'Adding event listeners in components without unbinding them on unmount leads to accumulated memory leaks and duplicate handler triggers.',
                    'code_snippet': stripped,
                    'recommendation': 'Return a cleanup function from useEffect removing the listener via window.removeEventListener.'
                })

            # 6. Insecure eval or Function constructor
            if re.search(r'\b(eval|new Function)\s*\(', stripped) and not stripped.startswith('//'):
                issues.append({
                    'type': 'security',
                    'severity': 'CRITICAL',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Arbitrary code execution via eval() / Function()',
                    'description': 'Evaluating strings as executable JavaScript enables remote code execution and script injection vulnerabilities.',
                    'code_snippet': stripped,
                    'recommendation': 'Avoid dynamic code evaluation; use standard object lookup or math parsers.'
                })

            # 7. Unhandled Promise Rejection (fetch without .catch)
            if 'fetch(' in stripped and '.then(' in stripped and '.catch(' not in content:
                issues.append({
                    'type': 'bug',
                    'severity': 'HIGH',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Unhandled Promise rejection in network fetch',
                    'description': 'Fetch promise chain does not attach a .catch handler. Network drops or HTTP timeouts will trigger unhandled promise rejection.',
                    'code_snippet': stripped,
                    'recommendation': 'Attach a .catch((err) => { ... }) handler or use try/catch with async/await.'
                })

        return issues

    def _analyze_java(self, file_path: str, content: str) -> List[Dict[str, Any]]:
        issues = []
        lines = content.split('\n')

        for idx, line in enumerate(lines, start=1):
            stripped = line.strip()

            # 1. Direct Optional.get() without isPresent()
            if '.get()' in stripped and not ('isPresent()' in stripped or 'orElse' in stripped or 'orElseThrow' in stripped):
                issues.append({
                    'type': 'bug',
                    'severity': 'HIGH',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Unchecked Optional.get() invocation (NoSuchElementException)',
                    'description': 'Calling .get() directly on an Optional without checking isPresent() throws NoSuchElementException at runtime if empty.',
                    'code_snippet': stripped,
                    'recommendation': 'Use optional.orElse(...) or optional.orElseThrow(() -> new NotFoundException(...)).'
                })

            # 2. Empty catch block
            if re.search(r'catch\s*\([^\)]+\)\s*\{\s*\}', stripped):
                issues.append({
                    'type': 'quality',
                    'severity': 'HIGH',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Empty catch block suppresses exceptions',
                    'description': 'Exceptions are swallowed silently, masking critical runtime errors and leaving the system in an indeterminate state.',
                    'code_snippet': stripped,
                    'recommendation': 'Log the caught exception using a structured logger (log.error("...", e)) or rethrow.'
                })

            # 3. Connection / Stream resource leak
            if ('new FileInputStream(' in stripped or 'new FileOutputStream(' in stripped) and 'try (' not in stripped:
                issues.append({
                    'type': 'bug',
                    'severity': 'HIGH',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Unclosed I/O Stream (Resource Leak)',
                    'description': 'I/O streams not enclosed in a try-with-resources statement remain open on disk if exceptions occur.',
                    'code_snippet': stripped,
                    'recommendation': 'Enclose in try-with-resources: try (InputStream is = new FileInputStream(...)) { ... }'
                })

        return issues

    def _analyze_cpp(self, file_path: str, content: str) -> List[Dict[str, Any]]:
        issues = []
        lines = content.split('\n')

        for idx, line in enumerate(lines, start=1):
            stripped = line.strip()

            # 1. gets() function usage
            if re.search(r'\bgets\(', stripped):
                issues.append({
                    'type': 'security',
                    'severity': 'CRITICAL',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Use of deprecated insecure gets() function',
                    'description': 'The gets() function performs no buffer bounds checking and is the leading cause of buffer overflow vulnerabilities.',
                    'code_snippet': stripped,
                    'recommendation': 'Replace with fgets() or std::getline to safely enforce maximum buffer length.'
                })

            # 2. strcpy / strcat without bounds
            if re.search(r'\b(strcpy|strcat)\(', stripped):
                issues.append({
                    'type': 'security',
                    'severity': 'HIGH',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Unbounded string copy function used',
                    'description': 'strcpy and strcat do not check destination buffer capacity, creating buffer overflow exposure.',
                    'code_snippet': stripped,
                    'recommendation': 'Use bounded alternatives such as strncpy, snprintf, or std::string.'
                })

        return issues

    def _analyze_universal_security(self, file_path: str, content: str) -> List[Dict[str, Any]]:
        issues = []
        lines = content.split('\n')

        secret_patterns = [
            (r'(?i)(api[_-]?key|secret[_-]?key|auth[_-]?token|password|private[_-]?key)\s*[:=]\s*["\'][A-Za-z0-9_\-\.]{16,}["\']',
             'CRITICAL', 'Hardcoded API secret or credential detected in source file'),
            (r'AIza[0-9A-Za-z-_]{35}',
             'CRITICAL', 'Exposed Google Gemini / Firebase API Key in source file'),
            (r'sk-[a-zA-Z0-9]{20,}',
             'CRITICAL', 'Exposed OpenAI Secret Key detected in source file'),
            (r'ghp_[a-zA-Z0-9]{36}',
             'CRITICAL', 'Exposed GitHub Personal Access Token detected in source file'),
            (r'AKIA[0-9A-Z]{16}',
             'CRITICAL', 'Exposed AWS Access Key ID detected in source file'),
            (r'https?://[a-zA-Z0-9_\-]+:[a-zA-Z0-9_\-]+@',
             'HIGH', 'Hardcoded credentials embedded inside connection URI')
        ]

        for idx, line in enumerate(lines, start=1):
            if line.strip().startswith(('#', '//', '/*', '*')):
                continue
            for pattern, severity, title in secret_patterns:
                if re.search(pattern, line):
                    issues.append({
                        'type': 'security',
                        'severity': severity,
                        'file_path': file_path,
                        'line_number': idx,
                        'title': title,
                        'description': 'Sensitive credentials should never be committed into source control repositories.',
                        'code_snippet': line.strip()[:80] + '...',
                        'recommendation': 'Extract sensitive secrets into environment variables (.env) or a secret manager.'
                    })
                    break

        return issues
