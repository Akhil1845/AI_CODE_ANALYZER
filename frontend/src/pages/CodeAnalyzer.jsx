import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Play, 
  Copy, 
  Check, 
  AlertTriangle, 
  Bug, 
  Zap, 
  Clock, 
  Terminal, 
  Sparkles, 
  RefreshCw,
  Code2,
  FileCode,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { dsaAnalyzer } from '../services/dsaAnalyzer';
import { storage } from '../services/storage';

const CODE_PRESETS = {
  Java: {
    title: 'LeetCode: Two Sum (O(N²) TLE & Nested Loops)',
    code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Nested quadratic loops
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[] { i, j };
                }
            }
        }
        return new int[0];
    }
}`,
    input: 'nums = [2, 7, 11, 15], target = 9'
  },
  Python: {
    title: 'CodeChef: Array Traversal with Off-By-One Index Range',
    code: `class Solution:
    def solve(self, nums: list[int]) -> int:
        total = 0
        # Off-by-one bug: range extends past array boundary
        for i in range(len(nums) + 1):
            total += nums[i]
        return total`,
    input: 'nums = [10, 20, 30, 40]'
  },
  'C++': {
    title: 'MentorPick: Binary Search Integer Overflow',
    code: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int low = 0;
        int high = nums.size() - 1;

        while (low <= high) {
            // Dangerous: (low + high) overflows 32-bit signed int
            int mid = (low + high) / 2;
            
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
};`,
    input: 'low = 1,000,000,000; high = 2,000,000,000'
  },
  C: {
    title: 'C: Unchecked Pointer & Array Size Traversal',
    code: `int calculateSum(int* arr, int size) {
    int sum = 0;
    // Off-by-one: i <= size accesses invalid memory
    for (int i = 0; i <= size; i++) {
        sum += arr[i];
    }
    return sum;
}`,
    input: 'arr = {5, 10, 15}, size = 3'
  }
};

export default function CodeAnalyzer() {
  const [language, setLanguage] = useState('Java');
  const [platform, setPlatform] = useState('LeetCode');
  const [code, setCode] = useState(CODE_PRESETS.Java.code);
  const [customInput, setCustomInput] = useState(CODE_PRESETS.Java.input);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (CODE_PRESETS[newLang]) {
      setCode(CODE_PRESETS[newLang].code);
      setCustomInput(CODE_PRESETS[newLang].input);
    }
    setAnalysisResult(null);
  };

  const handlePresetSelect = (presetKey) => {
    setLanguage(presetKey);
    setCode(CODE_PRESETS[presetKey].code);
    setCustomInput(CODE_PRESETS[presetKey].input);
    setAnalysisResult(null);
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      try {
        const result = dsaAnalyzer.analyze(code, language, platform, customInput);
        setAnalysisResult(result);

        // Store this REAL analysis in user storage so Dashboard shows real data
        storage.saveAnalysis({
          name: `${platform} ${language} Code Analysis`,
          type: 'CODE_SNIPPET',
          language,
          platform,
          code,
          testCase: customInput,
          result
        });
      } catch (err) {
        alert(err.message);
      } finally {
        setAnalyzing(false);
      }
    }, 450);
  };

  const handleCopyCode = () => {
    if (!analysisResult?.correctedCode) return;
    navigator.clipboard.writeText(analysisResult.correctedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '40px 0 85px' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 36px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(168, 85, 247, 0.18) 100%)',
              border: '1px solid rgba(236, 72, 153, 0.4)',
              color: '#f0abfc',
              fontSize: '12.5px',
              fontWeight: 700,
              marginBottom: '16px'
            }}>
              <Sparkles size={14} color="#ec4899" />
              <span>LeetCode • MentorPick • CodeChef • HackerRank Code Analyzer</span>
            </div>

            <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Trace Code Iterations & Spot Exact Logic Errors
            </h1>
            <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: 1.6 }}>
              Paste your Java, Python, C, or C++ code. CodeLens AI executes a step-by-step iteration trace, pinpoints exactly where and why it fails, and provides the optimal working logic.
            </p>
          </div>

          {/* Configuration Toolbar */}
          <div className="glass-card" style={{
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {/* Language selection */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#f0abfc', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Language
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['Java', 'Python', 'C++', 'C'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageChange(lang)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                        fontWeight: 700,
                        background: language === lang ? 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #a855f7 100%)' : 'rgba(9, 13, 26, 0.85)',
                        color: language === lang ? '#ffffff' : '#cbd5e1',
                        border: language === lang ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid var(--border-subtle)',
                        boxShadow: language === lang ? '0 0 15px rgba(236, 72, 153, 0.4)' : 'none',
                        transition: 'all 0.2s'
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform selector */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#cbd5e1', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Platform Target
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  style={{
                    background: 'rgba(9, 13, 26, 0.9)',
                    color: '#ffffff',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '7px 12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  <option value="LeetCode">LeetCode</option>
                  <option value="MentorPick">MentorPick</option>
                  <option value="CodeChef">CodeChef</option>
                  <option value="HackerRank">HackerRank</option>
                  <option value="Custom">Custom Algorithm</option>
                </select>
              </div>
            </div>

            {/* Quick Presets */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Load Buggy Sample:</span>
              <button
                type="button"
                onClick={() => handlePresetSelect('Java')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: 'rgba(217, 70, 239, 0.12)',
                  border: '1px solid rgba(217, 70, 239, 0.3)',
                  fontSize: '12px',
                  color: '#f0abfc',
                  fontWeight: 600
                }}
              >
                Two Sum (TLE)
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('Python')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  fontSize: '12px',
                  color: '#93c5fd',
                  fontWeight: 600
                }}
              >
                Off-By-One
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('C++')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  fontSize: '12px',
                  color: '#fb7185',
                  fontWeight: 600
                }}
              >
                Overflow
              </button>
            </div>
          </div>

          {/* Main Input Code Area */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {/* Left: Code Paste Area */}
            <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileCode size={16} color="#ec4899" />
                  <span>Paste {language} Code</span>
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                  {code.split('\n').length} lines
                </span>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={16}
                spellCheck="false"
                placeholder={`// Paste your ${language} solution here...`}
                style={{
                  width: '100%',
                  background: '#030408',
                  color: '#f8fafc',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13.5px',
                  lineHeight: 1.6,
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(37, 51, 94, 0.8)',
                  outline: 'none',
                  resize: 'vertical',
                  boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.9)'
                }}
              />

              {/* Optional Custom Input Box */}
              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Test Case / Input (Optional)
                </label>
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="e.g. nums = [2, 7, 11, 15], target = 9"
                  style={{
                    width: '100%',
                    background: 'rgba(9, 13, 26, 0.9)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={handleAnalyze}
                disabled={analyzing}
                style={{ width: '100%', marginTop: '18px', padding: '13px' }}
              >
                <Play size={16} fill="currentColor" />
                <span>{analyzing ? 'Tracing Code Execution...' : 'Analyze Code & Trace Iterations'}</span>
              </button>
            </div>

            {/* Right: Where it goes wrong (Failure Point Box) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {analysisResult ? (
                <>
                  {/* Failure Point Highlight Card */}
                  <div className="glass-card" style={{
                    padding: '24px',
                    border: '1px solid rgba(244, 63, 94, 0.5)',
                    background: 'linear-gradient(180deg, rgba(20, 10, 25, 0.95) 0%, rgba(9, 13, 26, 0.95) 100%)',
                    boxShadow: '0 0 30px rgba(244, 63, 94, 0.25)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-critical">
                          <Bug size={12} />
                          {analysisResult.primaryIssue.title}
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#fb7185', fontWeight: 800 }}>
                        Fails at Line {analysisResult.primaryIssue.line}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                      Exact Point of Failure
                    </h3>

                    <pre style={{
                      background: '#04050a',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      color: '#fb7185',
                      borderLeft: '4px solid #f43f5e',
                      marginBottom: '14px',
                      overflowX: 'auto'
                    }}>
                      <code>{analysisResult.primaryIssue.failingCode}</code>
                    </pre>

                    <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '12px' }}>
                      <strong>Why it fails:</strong> {analysisResult.primaryIssue.reason}
                    </p>

                    <div style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(244, 63, 94, 0.12)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      fontSize: '13px',
                      color: '#fca5a5'
                    }}>
                      <strong>Breaking Test Case:</strong> <code>{analysisResult.primaryIssue.breakingInput}</code>
                    </div>
                  </div>

                  {/* Complexity Comparison Badge */}
                  <div className="glass-card" style={{ padding: '20px', border: '1px solid rgba(168, 85, 247, 0.35)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#f0abfc', marginBottom: '12px', letterSpacing: '0.04em' }}>
                      TIME & SPACE COMPLEXITY COMPARISON
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                      <div style={{ background: 'rgba(9, 13, 26, 0.85)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                        <div style={{ fontSize: '11px', color: '#fb7185', fontWeight: 700 }}>YOUR CURRENT CODE</div>
                        <div style={{ fontSize: '17px', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                          {analysisResult.logicGuidance.complexityComparison.userTime}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Space: {analysisResult.logicGuidance.complexityComparison.userSpace}</div>
                      </div>

                      <div style={{ background: 'rgba(9, 13, 26, 0.85)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(217, 70, 239, 0.4)' }}>
                        <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700 }}>OPTIMAL COMPLEXITY</div>
                        <div style={{ fontSize: '17px', fontWeight: 900, color: '#38bdf8', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                          {analysisResult.logicGuidance.complexityComparison.optimalTime}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>Space: {analysisResult.logicGuidance.complexityComparison.optimalSpace}</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass-card" style={{
                  padding: '48px 30px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  border: '1px dashed var(--border-light)'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(217, 70, 239, 0.12)',
                    border: '1px solid rgba(217, 70, 239, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <Code2 size={28} color="#ec4899" />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                    Ready to Trace Your Algorithm
                  </h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '340px' }}>
                    Paste your code from LeetCode, CodeChef, or MentorPick on the left and click "Analyze Code" to generate the full iteration walkthrough.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Full Code Iteration Walkthrough Table */}
          {analysisResult && (
            <div className="glass-card" style={{
              padding: '28px',
              marginBottom: '32px',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              boxShadow: '0 20px 50px -10px rgba(4, 5, 10, 0.95)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
                    Full Code Iteration Walkthrough
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#94a3b8' }}>
                    Step-by-step tracing of loop iterations, variable state mutations, and condition checks:
                  </p>
                </div>
                <span className="badge badge-high">
                  {analysisResult.iterations.length} Trace Steps
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)'
                }}>
                  <thead>
                    <tr style={{ background: 'rgba(9, 13, 26, 0.9)', borderBottom: '1px solid var(--border-light)' }}>
                      <th style={{ padding: '12px 14px', textAlign: 'left', color: '#f0abfc' }}>Step</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', color: '#f0abfc' }}>Line</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', color: '#f0abfc' }}>Variables State</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', color: '#f0abfc' }}>Condition / Expression</th>
                      <th style={{ padding: '12px 14px', textAlign: 'left', color: '#f0abfc' }}>Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisResult.iterations.map((step) => {
                      const isFail = step.verdict.includes('FAIL') || step.verdict.includes('CRASH');
                      return (
                        <tr
                          key={step.step}
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            background: isFail ? 'rgba(244, 63, 94, 0.12)' : 'transparent',
                            transition: 'background 0.2s'
                          }}
                        >
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: isFail ? '#fb7185' : '#ffffff' }}>
                            #{step.step}
                          </td>
                          <td style={{ padding: '12px 14px', color: '#94a3b8' }}>
                            Line {step.line}
                          </td>
                          <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>
                            {Object.entries(step.variables).map(([k, v]) => (
                              <span key={k} style={{ marginRight: '10px' }}>
                                <strong style={{ color: '#f0abfc' }}>{k}</strong>={v}
                              </span>
                            ))}
                          </td>
                          <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>
                            {step.evaluation}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            {isFail ? (
                              <span className="badge badge-critical" style={{ fontSize: '10px' }}>
                                {step.verdict}
                              </span>
                            ) : (
                              <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd', fontSize: '10px' }}>
                                {step.verdict}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Correct Logic & Working Runnable Solution */}
          {analysisResult && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
              gap: '24px'
            }}>
              {/* Left: Correct Logic & Algorithm */}
              <div className="glass-card" style={{ padding: '26px', border: '1px solid rgba(59, 130, 246, 0.35)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Sparkles size={18} color="#38bdf8" />
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                    Correct Logic & Intuition
                  </h3>
                </div>

                <div style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  marginBottom: '16px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#93c5fd'
                }}>
                  Recommended Approach: {analysisResult.logicGuidance.concept}
                </div>

                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.65, marginBottom: '16px' }}>
                  {analysisResult.logicGuidance.description}
                </p>

                <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#f0abfc', marginBottom: '8px', letterSpacing: '0.04em' }}>
                  HOW TO IMPLEMENT PROPERLY:
                </h4>

                <ol style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', color: '#cbd5e1' }}>
                  {analysisResult.logicGuidance.algorithmSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Right: Working Corrected Runnable Solution */}
              <div className="glass-card" style={{
                padding: '26px',
                border: '1px solid rgba(217, 70, 239, 0.45)',
                background: 'linear-gradient(180deg, rgba(15, 21, 43, 0.95) 0%, rgba(20, 10, 32, 0.95) 100%)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} color="#d946ef" />
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                      Corrected Working Code ({language})
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    {copied ? (
                      <>
                        <Check size={14} color="#d946ef" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <pre style={{
                  background: '#030408',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: '#f0abfc',
                  border: '1px solid rgba(217, 70, 239, 0.35)',
                  maxHeight: '380px',
                  overflowY: 'auto'
                }}>
                  <code>{analysisResult.correctedCode}</code>
                </pre>

                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#94a3b8' }}>
                  <CheckCircle2 size={15} color="#d946ef" />
                  <span>Ready to paste directly into {platform} judge. Passes all edge test cases.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
