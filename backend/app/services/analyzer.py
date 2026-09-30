import ast
import re
from typing import List, Dict, Any

class StaticAnalyzer:
    """
    Multi-language AST & Heuristic Static Code Analyzer
    Detects Bugs, Security Vulnerabilities, Performance Bottlenecks, and Quality Issues.
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

        # Universal checks (secrets, hardcoded keys)
        issues.extend(self._analyze_universal_security(file_path, content))

        return issues

    def _analyze_python(self, file_path: str, content: str) -> List[Dict[str, Any]]:
        issues = []
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
                            'description': 'Catching BaseException or broad Exception can swallow unexpected system exits, KeyboardInterrupt, or critical errors.',
                            'code_snippet': 'except Exception:',
                            'recommendation': 'Catch specific, expected exception classes instead of broad Exception.'
                        })

                # 2. Mutable default argument in function definition
                if isinstance(node, ast.FunctionDef):
                    for default in node.args.defaults:
                        if isinstance(default, (ast.List, ast.Dict, ast.Set)):
                            issues.append({
                                'type': 'bug',
                                'severity': 'HIGH',
                                'file_path': file_path,
                                'line_number': getattr(node, 'lineno', 1),
                                'title': f'Mutable default argument in function "{node.name}"',
                                'description': 'Default parameter value is a mutable collection. It is evaluated once when the function is defined and shared across all calls.',
                                'code_snippet': f'def {node.name}(..., param=[]):',
                                'recommendation': 'Use None as the default argument value and initialize the collection inside the function body.'
                            })

                # 3. SQL Injection pattern (string formatting inside execute)
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

        return issues

    def _analyze_java(self, file_path: str, content: str) -> List[Dict[str, Any]]:
        issues = []
        lines = content.split('\n')

        for idx, line in enumerate(lines, start=1):
            stripped = line.strip()

            # 1. Direct Optional.get() without isPresent()
            if '.get()' in stripped and not ('isPresent()' in stripped or 'orElse' in stripped):
                issues.append({
                    'type': 'bug',
                    'severity': 'HIGH',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Unchecked Optional.get() invocation',
                    'description': 'Calling .get() directly on an Optional without checking isPresent() or using orElseThrow() can throw NoSuchElementException at runtime.',
                    'code_snippet': stripped,
                    'recommendation': 'Use optional.orElse(...) or if (optional.isPresent()) check.'
                })

            # 2. Empty catch block
            if re.search(r'catch\s*\([^\)]+\)\s*\{\s*\}', stripped):
                issues.append({
                    'type': 'quality',
                    'severity': 'HIGH',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Empty catch block suppresses exceptions',
                    'description': 'Exceptions are swallowed silently, hiding bugs and leaving the application in an indeterminate state.',
                    'code_snippet': stripped,
                    'recommendation': 'Log the caught exception using a logger (e.g., log.error("...", e)) or rethrow.'
                })

            # 3. System.out.println in production code
            if 'System.out.println(' in stripped or 'System.err.println(' in stripped:
                issues.append({
                    'type': 'performance',
                    'severity': 'LOW',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Use of System.out.println in production code',
                    'description': 'Direct stdout writes cause thread synchronization and cannot be filtered or formatted through SLF4J/Logback.',
                    'code_snippet': stripped,
                    'recommendation': 'Replace System.out.println with a logger (e.g., private static final Logger log = LoggerFactory.getLogger(...)).'
                })

            # 4. String concatenation inside loops
            if '+=' in stripped and ('for (' in content or 'while (' in content) and ('String ' in content or '""' in stripped):
                if idx < 80:  # heuristic sample
                    issues.append({
                        'type': 'performance',
                        'severity': 'MEDIUM',
                        'file_path': file_path,
                        'line_number': idx,
                        'title': 'String concatenation in loop creates excess objects',
                        'description': 'Repeatedly appending strings with "+=" creates new String instances on the heap for every iteration, causing garbage collection spikes.',
                        'code_snippet': stripped,
                        'recommendation': 'Use StringBuilder for mutable string concatenation inside loops.'
                    })

        return issues

    def _analyze_javascript(self, file_path: str, content: str) -> List[Dict[str, Any]]:
        issues = []
        lines = content.split('\n')

        for idx, line in enumerate(lines, start=1):
            stripped = line.strip()

            # 1. dangerouslySetInnerHTML
            if 'dangerouslySetInnerHTML' in stripped:
                issues.append({
                    'type': 'security',
                    'severity': 'HIGH',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Potential XSS vulnerability via dangerouslySetInnerHTML',
                    'description': 'Injecting unescaped HTML directly bypasses React\'s built-in XSS sanitization and allows malicious script execution.',
                    'code_snippet': stripped,
                    'recommendation': 'Sanitize input with DOMPurify before rendering, or prefer React standard child rendering.'
                })

            # 2. == instead of ===
            if re.search(r'[^=!<>]={2}[^=]', stripped) and not stripped.startswith('//'):
                issues.append({
                    'type': 'bug',
                    'severity': 'LOW',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Loose equality operator (==) used',
                    'description': 'Using loose equality enables implicit type coercion which frequently causes subtle unexpected bugs.',
                    'code_snippet': stripped,
                    'recommendation': 'Use strict equality (===) to compare both value and type.'
                })

            # 3. console.log
            if 'console.log(' in stripped and not stripped.startswith('//'):
                issues.append({
                    'type': 'quality',
                    'severity': 'LOW',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Unremoved console.log in source file',
                    'description': 'Console logs clutter the client console and can inadvertently expose internal state or sensitive data.',
                    'code_snippet': stripped,
                    'recommendation': 'Remove debug logging before deploying to production.'
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

            # 3. malloc without free check
            if 'malloc(' in stripped and 'free(' not in content:
                issues.append({
                    'type': 'performance',
                    'severity': 'MEDIUM',
                    'file_path': file_path,
                    'line_number': idx,
                    'title': 'Dynamic memory allocation without explicit free()',
                    'description': 'Memory allocated via malloc() does not appear to be deallocated, leading to progressive memory leaks.',
                    'code_snippet': stripped,
                    'recommendation': 'Use std::unique_ptr / std::make_unique in C++, or ensure free() is called.'
                })

        return issues

    def _analyze_universal_security(self, file_path: str, content: str) -> List[Dict[str, Any]]:
        issues = []
        lines = content.split('\n')

        # Regex patterns for exposed keys
        secret_patterns = [
            (r'(?i)(api[_-]?key|secret[_-]?key|auth[_-]?token|password)\s*[:=]\s*["\'][A-Za-z0-9_\-\.]{16,}["\']',
             'CRITICAL', 'Hardcoded API secret or credential detected in source file'),
            (r'AIza[0-9A-Za-z-_]{35}',
             'CRITICAL', 'Exposed Google Gemini / Firebase API Key in source file'),
            (r'sk-[a-zA-Z0-9]{20,}',
             'CRITICAL', 'Exposed OpenAI Secret Key detected in source file'),
            (r'ghp_[a-zA-Z0-9]{36}',
             'CRITICAL', 'Exposed GitHub Personal Access Token detected in source file'),
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
                    break  # Avoid double reporting same line

        return issues
