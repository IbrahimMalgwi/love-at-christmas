import React, { useState } from 'react'
import { Share2, Facebook, Twitter, Link2, Mail, Check } from 'lucide-react'
import Button from '../common/Button'

const SocialShare = ({ url, title, description }) => {
    const [showShareMenu, setShowShareMenu] = useState(false)
    const [copied, setCopied] = useState(false)

    const shareUrl = url || window.location.href
    const shareTitle = title || 'Love At Christmas'
    const shareDescription = description || 'Join us in spreading love and joy this Christmas season!'

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
        email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareDescription + '\n\n' + shareUrl)}`
    }

    const handleShare = (platform) => {
        if (platform === 'copy') {
            navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            return
        }

        const shareWindow = window.open(
            shareLinks[platform],
            'share',
            'width=600,height=400'
        )
        shareWindow?.focus()
    }

    return (
        <div className="relative">
            <Button
                variant="outline"
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center space-x-2"
            >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
            </Button>

            {showShareMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-2 space-y-1">
                        <button
                            onClick={() => handleShare('facebook')}
                            className="flex items-center space-x-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            <Facebook className="h-4 w-4 text-blue-600" />
                            <span>Facebook</span>
                        </button>

                        <button
                            onClick={() => handleShare('twitter')}
                            className="flex items-center space-x-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            <Twitter className="h-4 w-4 text-blue-400" />
                            <span>Twitter</span>
                        </button>

                        <button
                            onClick={() => handleShare('email')}
                            className="flex items-center space-x-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            <Mail className="h-4 w-4 text-gray-600" />
                            <span>Email</span>
                        </button>

                        <button
                            onClick={() => handleShare('copy')}
                            className="flex items-center space-x-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            {copied ? (
                                <Check className="h-4 w-4 text-green-600" />
                            ) : (
                                <Link2 className="h-4 w-4 text-gray-600" />
                            )}
                            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Close when clicking outside */}
            {showShareMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowShareMenu(false)}
                />
            )}
        </div>
    )
}

export default SocialShare