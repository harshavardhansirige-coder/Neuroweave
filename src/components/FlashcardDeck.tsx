import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { Card } from './UI/Card';
import { Button } from './UI/Button';
import { showToast } from './UI/Toast';
import { RotateCw, BrainCircuit, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlashcardDeckProps {
  flashcards: Flashcard[];
  onReviewCard: (cardId: string, known: boolean) => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  flashcards = [],
  onReviewCard
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCards, setSessionCards] = useState<Flashcard[]>([]);

  useEffect(() => {
    // Only show active flashcards (for simplicity, let's load all or filter if needed)
    setSessionCards(flashcards);
    setCurrentIdx(0);
    setIsFlipped(false);
  }, [flashcards]);

  const activeCard = sessionCards[currentIdx];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleResponse = (known: boolean) => {
    if (!activeCard) return;

    onReviewCard(activeCard.id, known);
    
    // Update local card parameters to show changes instantly
    const updatedCards = [...sessionCards];
    const updatedCard = { ...activeCard };
    if (known) {
      updatedCard.box_level = Math.min(updatedCard.box_level + 1, 5);
      showToast('Box level upgraded! Scheduled further out.', 'success');
    } else {
      updatedCard.box_level = 1;
      showToast('Card scheduled for immediate review.', 'info');
    }
    updatedCards[currentIdx] = updatedCard;
    setSessionCards(updatedCards);

    // Auto-advance card
    setTimeout(() => {
      setIsFlipped(false);
      if (currentIdx < sessionCards.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        showToast('Completed review of active flashcard deck!', 'success');
        setCurrentIdx(0);
      }
    }, 300);
  };

  if (sessionCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-500">
        <BrainCircuit size={48} className="text-zinc-600 mb-4" />
        <p className="font-semibold">No active flashcards available</p>
        <p className="text-xs text-zinc-600 mt-1">Start generating a learning session to study flashcards.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      {/* Leitner Title Info */}
      <div className="flex justify-between items-center text-xs text-zinc-500 font-semibold px-2">
        <span>CARD {currentIdx + 1} OF {sessionCards.length}</span>
        <span className="flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary-light px-2.5 py-0.5 rounded-full">
          Leitner Box {activeCard?.box_level} / 5
        </span>
      </div>

      {/* 3D Flashcard container */}
      <div 
        className="w-full h-80 relative cursor-pointer group select-none"
        onClick={handleFlip}
        style={{ perspective: '1000px' }}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Face */}
          <Card 
            className="absolute inset-0 p-8 flex flex-col items-center justify-between bg-slate-950/60 border border-white/5 shadow-2xl rounded-2xl"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            hoverEffect={false}
          >
            <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest flex items-center gap-1.5">
              <BrainCircuit size={12} className="text-primary" /> Concept Card
            </div>
            
            <div className="text-xl font-medium text-white text-center leading-snug px-2">
              {activeCard?.front}
            </div>

            <div className="text-xs text-zinc-500 flex items-center gap-1.5 uppercase font-semibold">
              <RotateCw size={12} className="text-zinc-500 group-hover:rotate-45 transition-transform" />
              Click card to flip
            </div>
          </Card>

          {/* Back Face */}
          <Card 
            className="absolute inset-0 p-8 flex flex-col items-center justify-between bg-slate-950/60 border border-secondary/20 shadow-2xl rounded-2xl"
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)' 
            }}
            hoverEffect={false}
          >
            <div className="text-[10px] uppercase font-bold text-secondary-light tracking-widest flex items-center gap-1.5">
              <CheckCircle2 size={12} /> Solution Explanation
            </div>

            <div className="text-base text-zinc-200 text-center leading-relaxed overflow-y-auto max-h-48 px-2 font-light">
              {activeCard?.back}
            </div>

            <div className="text-xs text-zinc-500 flex items-center gap-1.5 uppercase font-semibold">
              Click to flip back
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Leitner Box Rating Buttons */}
      <div className="flex gap-4 items-center justify-center pt-2">
        <Button 
          variant="danger" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleResponse(false);
          }}
          className="flex items-center gap-1.5"
        >
          <AlertCircle size={14} /> Need Practice
        </Button>
        
        <Button 
          variant="primary" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleResponse(true);
          }}
          className="flex items-center gap-1.5"
        >
          <CheckCircle2 size={14} /> I Understand
        </Button>
      </div>

      {/* Left/Right Deck Navigation */}
      <div className="flex justify-between items-center text-xs text-zinc-600 px-6 pt-4">
        <button
          disabled={currentIdx === 0}
          onClick={() => { setIsFlipped(false); setCurrentIdx(currentIdx - 1); }}
          className="flex items-center gap-1 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft size={16} /> Prev Card
        </button>
        <button
          disabled={currentIdx === sessionCards.length - 1}
          onClick={() => { setIsFlipped(false); setCurrentIdx(currentIdx + 1); }}
          className="flex items-center gap-1 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          Next Card <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
export default FlashcardDeck;
