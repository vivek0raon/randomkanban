import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowRight, Zap, Target, Lock } from 'lucide-react';
import kanbanGraphic from '../assets/kanban_board_graphic.png';
import telegramGraphic from '../assets/telegram_integration_graphic.png';

export default function LandingPage() {
  return (
    <div className="landing-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="app-header" style={{ position: 'relative', background: 'transparent', border: 'none', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="app-title" style={{ fontSize: '1.75rem' }}>
          <LayoutDashboard className="app-title-icon" size={32} />
          <span>NovaKanban</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/auth" className="button-primary" style={{ textDecoration: 'none', whiteSpace: 'nowrap', fontSize: 'clamp(0.75rem, 2vw, 0.95rem)' }}>
            <span className="hide-mobile">Login / Get Started</span>
            <span className="show-mobile">Get Started</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(2rem, 5vw, 4rem) 1.25rem' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 800, marginBottom: '1.5rem', background: 'linear-gradient(to right, #f8f8f2, #a2aab8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Manage Chaos, <br/>
          <span style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Beautifully.</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '3rem', lineHeight: '1.6' }}>
          The ultimate premium glassmorphic Kanban workspace. Organize your life, categorize multiple projects, track deadlines, and never miss a beat.
        </p>
        
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem' }}>
          <FeatureCard 
            icon={<Target size={32} color="var(--accent-emerald)" />} 
            title="Categorized Boards" 
            desc="Segregate work and personal projects seamlessly." 
          />
          <FeatureCard 
            icon={<Zap size={32} color="var(--accent-amber)" />} 
            title="Smart Timers" 
            desc="Set due dates and get automatic browser notifications." 
          />
          <FeatureCard 
            icon={<Lock size={32} color="var(--accent-rose)" />} 
            title="Secure Accounts" 
            desc="Encrypted JWT authentication keeps your workflow private." 
          />
        </div>

        <section style={{ marginTop: '6rem', maxWidth: '1000px', width: '100%', textAlign: 'left' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', textAlign: 'center', marginBottom: '4rem', color: 'var(--text-main)' }}>Experience the Next Level of Productivity</h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3rem', marginBottom: '6rem' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>Visually Stunning Workspace</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                NovaKanban replaces the dull grids of typical project management tools with a vibrant, premium glassmorphism interface. With smooth drag-and-drop interactions, aesthetic neon accents, and a dark mode designed to reduce eye strain, organizing your tasks has never felt this good.
              </p>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <img src={kanbanGraphic} alt="Aesthetic Kanban Board" style={{ width: '100%', borderRadius: '16px', boxShadow: '0 10px 30px rgba(6, 182, 212, 0.2)', border: '1px solid var(--panel-border)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3rem', flexDirection: 'row-reverse' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--accent-indigo)', marginBottom: '1rem' }}>Instant Telegram Notifications</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                Never miss a deadline again. Connect your account to our Telegram bot and receive instant updates when a task is due or expired. Our background scheduler keeps an eye on your boards so you can focus entirely on the work that matters.
              </p>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <img src={telegramGraphic} alt="Telegram Integration Notification" style={{ width: '100%', borderRadius: '16px', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.2)', border: '1px solid var(--panel-border)' }} />
            </div>
          </div>
        </section>
      </main>
      
      {/* Decorative floating elements */}
      <div className="glass-card" style={{ position: 'absolute', top: '20%', left: '10%', width: '200px', height: '100px', transform: 'rotate(-10deg)', zIndex: -1, opacity: 0.5 }}></div>
      <div className="glass-card" style={{ position: 'absolute', bottom: '20%', right: '10%', width: '250px', height: '150px', transform: 'rotate(15deg)', zIndex: -1, opacity: 0.5 }}></div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', width: '280px', textAlign: 'left', transition: 'transform 0.3s' }}>
      <div style={{ marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{desc}</p>
    </div>
  );
}
