import React, { useState } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { CheckCircle, Linkedin, Brain, Sparkles, Zap } from 'lucide-react'

export default function CertificateDownloadPage() {
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleVerifyAndDownload = async () => {
    if (!linkedinUrl.trim()) return

    setIsLoading(true)
    // Simulate verification process
    setTimeout(() => {
      setIsVerified(true)
      setIsLoading(false)
      // Trigger certificate download
      const link = document.createElement('a')
      link.href = '/ai-certificate-preview.jpg'
      link.download = 'AI-Program-Certificate.pdf'
      link.click()
    }, 2000)
  }

  const handleLinkedInShare = () => {
    const shareText = encodeURIComponent(
      "🚀 Thrilled to announce I've completed an advanced AI program! This journey has equipped me with cutting-edge skills in artificial intelligence and machine learning. Ready to apply these insights to drive innovation! #AI #MachineLearning #Innovation #TechSkills #ArtificialIntelligence",
    )
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&text=${shareText}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  return (
    <div
      className="min-h-screen bg-purple-600"
      style={{
        background: 'linear-gradient(135deg, #9333ea 0%, #2563eb 50%, #06b6d4 100%)',
      }}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-cyan-400/30 animate-pulse"></div>
        <div
          className="absolute inset-0 bg-gradient-to-tl from-blue-600/20 via-indigo-500/30 to-purple-600/20 animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>

        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400/60 rounded-full animate-bounce shadow-lg"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-400/70 rounded-full animate-ping shadow-lg"></div>
        <div className="absolute top-1/2 left-3/4 w-5 h-5 bg-green-400/50 rounded-full animate-pulse shadow-lg"></div>
        <div
          className="absolute top-1/3 right-1/3 w-2 h-2 bg-orange-400/60 rounded-full animate-bounce shadow-lg"
          style={{ animationDelay: '0.5s' }}
        ></div>
        <div
          className="absolute top-2/3 left-1/6 w-3 h-3 bg-red-400/50 rounded-full animate-ping shadow-lg"
          style={{ animationDelay: '1.5s' }}
        ></div>
        <div
          className="absolute top-1/6 right-2/3 w-4 h-4 bg-indigo-400/60 rounded-full animate-pulse shadow-lg"
          style={{ animationDelay: '2s' }}
        ></div>

        <div
          className="absolute top-1/5 left-1/2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rotate-45 animate-spin opacity-30 shadow-lg"
          style={{ animationDuration: '8s' }}
        ></div>
        <div className="absolute bottom-1/4 right-1/5 w-6 h-6 bg-gradient-to-br from-green-400 to-teal-500 rotate-12 animate-bounce opacity-40 shadow-lg"></div>
      </div>

      <header className="border-b border-white/20 bg-black/20 backdrop-blur-md relative z-10 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white drop-shadow-lg">AI Program Certification</h1>
                <p className="text-sm text-white/90 drop-shadow-md">Advanced Intelligence Achievement Portal</p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-purple-600 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse">
              <Brain className="h-4 w-4" />
              AI Certificate Ready for Download
            </div>
            <h2 className="text-3xl font-bold text-balance text-white drop-shadow-lg">
              Download Your AI Program Certificate
            </h2>
            <p className="text-lg text-white/95 text-balance drop-shadow-md">
              Share your AI achievement on LinkedIn to unlock and download your official certificate
            </p>
          </div>

          <Card className="overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-md relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur-xl"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-lg">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg animate-pulse">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Artificial Intelligence Program Certificate</CardTitle>
                <CardDescription>Official certification of AI mastery and completion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 via-blue-50 to-cyan-100 dark:from-purple-950/50 dark:via-blue-950/50 dark:to-cyan-950/50 rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-700 relative overflow-hidden">
                  <div className="absolute inset-4 bg-white dark:bg-gray-900 rounded-lg shadow-inner filter blur-[1px] opacity-95">
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div className="text-center space-y-2">
                        <div className="flex justify-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                            <Brain className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          CERTIFICATE OF COMPLETION
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Artificial Intelligence Program</p>
                      </div>
                      <div className="text-center space-y-3">
                        <div className="h-1 bg-gradient-to-r from-purple-500 to-blue-600 rounded mx-8"></div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">This certifies that</p>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mx-12"></div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          has successfully completed the Advanced AI Program
                        </p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            AI Powered
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">2024</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px]">
                    <div className="text-center space-y-2 bg-white/95 dark:bg-gray-900/95 p-4 rounded-lg shadow-lg">
                      <Brain className="h-8 w-8 text-purple-600 mx-auto" />
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">AI Certificate Preview</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Complete verification to unlock</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-lg">
                      1
                    </div>
                    <div className="space-y-3 flex-1">
                      <div>
                        <h3 className="font-medium">Share Your AI Achievement on LinkedIn</h3>
                        <p className="text-sm text-gray-600">
                          Showcase your artificial intelligence expertise to your professional network
                        </p>
                      </div>
                      <Button
                        onClick={handleLinkedInShare}
                        className="w-full bg-[#0077B5] hover:bg-[#005885] text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        Share AI Achievement on LinkedIn
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-lg">
                      2
                    </div>
                    <div className="space-y-3 flex-1">
                      <div>
                        <h3 className="font-medium">Paste Your LinkedIn Post URL</h3>
                        <p className="text-sm text-gray-600">
                          Copy and paste the link to your AI achievement post below
                        </p>
                      </div>
                      <div className="space-y-3">
                        <Input
                          placeholder="https://www.linkedin.com/posts/..."
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          className="bg-background border-purple-200 dark:border-purple-800 focus:border-purple-500 transition-colors"
                        />
                        <Button
                          onClick={handleVerifyAndDownload}
                          disabled={!linkedinUrl.trim() || isLoading}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                          size="lg"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Verifying AI Achievement...
                            </>
                          ) : isVerified ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Download AI Certificate
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Verify & Download AI Certificate
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {isVerified && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">AI Achievement Verified!</span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Your AI program certificate download should begin automatically. Congratulations on mastering
                      artificial intelligence!
                    </p>
                  </div>
                )}
              </CardContent>
            </div>
          </Card>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-6 text-sm text-white drop-shadow-md">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-300" />
                <span className="text-white">Secure Download</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-300" />
                <span className="text-white">AI Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-300" />
                <span className="text-white">Instant Verification</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/20 bg-black/20 backdrop-blur-md mt-16 relative z-10 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-white">
              <Brain className="h-5 w-5" />
              <span className="font-medium">AI Program Certification</span>
            </div>
            <p className="text-sm text-white/80">
              Questions about your AI certificate? Contact our support team for assistance.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <a href="#" className="text-white/90 hover:text-white transition-colors">
                Support
              </a>
              <span className="text-white/50">•</span>
              <a href="#" className="text-white/90 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <span className="text-white/50">•</span>
              <a href="#" className="text-white/90 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
