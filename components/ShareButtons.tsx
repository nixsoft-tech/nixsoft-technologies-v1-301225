import React, { useEffect, useState } from 'react';
import { Check, Link as LinkIcon, Linkedin } from 'lucide-react';
import XLogo from './XLogo';
import { SOCIAL_LINKS } from '../constants';

const BUTTON = 'p-2 bg-slate-50 rounded-full text-slate-500 transition-colors';

/** "@nixsoft1" from the X profile URL in constants.ts, for "via @nixsoft1" on shares. */
const X_HANDLE = SOCIAL_LINKS.x.split('/').filter(Boolean).pop();

/**
 * Share links for a page: X and LinkedIn open their share dialogs in a new
 * tab (plain links, so they work before the app's JavaScript loads), and the
 * last button copies the page URL.
 */
const ShareButtons: React.FC<{ url: string; title: string }> = ({ url, title }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // No clipboard access (older browser, non-secure context): let the reader copy it.
      window.prompt('Copy this link:', url);
    }
  };

  const u = encodeURIComponent(url);
  const xShare = `https://x.com/intent/post?url=${u}&text=${encodeURIComponent(title)}${X_HANDLE ? `&via=${X_HANDLE}` : ''}`;
  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-bold text-slate-900">Share this post:</span>
      <a href={xShare} target="_blank" rel="noopener noreferrer" aria-label="Share on X" title="Share on X"
        className={`${BUTTON} hover:bg-slate-900 hover:text-white`}>
        <XLogo size={20} />
      </a>
      <a href={linkedInShare} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" title="Share on LinkedIn"
        className={`${BUTTON} hover:bg-blue-50 hover:text-blue-700`}>
        <Linkedin size={20} aria-hidden="true" />
      </a>
      <button type="button" onClick={copyLink} aria-label="Copy link to this post" title={copied ? 'Link copied' : 'Copy link'}
        className={`${BUTTON} ${copied ? 'bg-green-50 text-green-600' : 'hover:bg-slate-200'}`}>
        {copied ? <Check size={20} aria-hidden="true" /> : <LinkIcon size={20} aria-hidden="true" />}
      </button>
      <span role="status" className="text-sm text-green-600">{copied ? 'Link copied' : ''}</span>
    </div>
  );
};

export default ShareButtons;
