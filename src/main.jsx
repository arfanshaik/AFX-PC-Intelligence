import React, {useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, HashRouter, MemoryRouter} from 'react-router-dom';
import '@fontsource/archivo/latin-400.css';
import '@fontsource/archivo/latin-600.css';
import '@fontsource/archivo/latin-700.css';
import '@fontsource/archivo/latin-800.css';
import '@fontsource/archivo/latin-900.css';
import '@fontsource/space-grotesk/latin-400.css';
import '@fontsource/space-grotesk/latin-500.css';
import './styles.css';
import './styles-3d.css';
import './styles-chat.css';
import App from './App';

class ErrorBoundary extends React.Component {
  state = {error:null};
  static getDerivedStateFromError(error) { return {error}; }
  render() {
    if (!this.state.error) return this.props.children;
    return <section className="page app-error" role="alert">
      <h1>AFX COULDN’T OPEN.</h1>
      <p>{this.state.error.message || 'An unexpected error interrupted the app.'}</p>
      <details><summary>Show error details</summary><pre>{String(this.state.error.stack || this.state.error)}</pre></details>
      <button className="action" onClick={()=>window.location.reload()}>Reload AFX ↗</button>
    </section>;
  }
}
const inlinePreview = Boolean(globalThis.__AFX_INLINE_PREVIEW__);
const Router = inlinePreview ? MemoryRouter : location.protocol === 'file:' ? HashRouter : BrowserRouter;
function Application() {
  useEffect(()=>{window.__AFX_APP_READY__=true;},[]);
  return <Router><App initiallyEntered={inlinePreview}/></Router>;
}
const root = document.getElementById(inlinePreview ? 'afx-inline-preview' : 'root');
createRoot(root).render(<ErrorBoundary><Application/></ErrorBoundary>);
