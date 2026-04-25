'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shuffle, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface InteractiveFlashcardsProps {
  cards: Flashcard[];
  onProgressChange?: (progress: { completed: number; total: number }) => void;
  onCardFlip?: (cardId: string, isFlipped: boolean) => void;
}

const InteractiveFlashcards: React.FC<InteractiveFlashcardsProps> = ({
  cards: initialCards,
  onProgressChange,
  onCardFlip,
}) => {
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCards, setCompletedCards] = useState<Set<string>>(new Set());
  const [perspective, setPerspective] = useState(0);

  useEffect(() => {
    onProgressChange?.({
      completed: completedCards.size,
      total: cards.length,
    });
  }, [completedCards, cards.length, onProgressChange]);

  const currentCard = cards[currentIndex];
  const progressPercentage = (completedCards.size / cards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onCardFlip?.(currentCard.id, !isFlipped);
    setPerspective((prev) => prev + (isFlipped ? -180 : 180));
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      setPerspective(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
      setPerspective(0);
    }
  };

  const handleMarkComplete = () => {
    const newCompleted = new Set(completedCards);
    newCompleted.add(currentCard.id);
    setCompletedCards(newCompleted);
    handleNext();
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setPerspective(0);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompletedCards(new Set());
    setPerspective(0);
  };

  if (cards.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No flashcards available</p>
        </CardContent>
      </Card>
    );
  }

  const isCompleted = completedCards.has(currentCard.id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Flashcards</CardTitle>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Card {currentIndex + 1} of {cards.length}
              </span>
              <span className="text-gray-600">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="perspective-container">
            <div
              className="relative w-full h-80 rounded-lg cursor-pointer transition-transform duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateY(${perspective}deg)`,
              }}
              onClick={handleFlip}
            >
              <div
                className={`absolute inset-0 rounded-lg p-8 flex flex-col justify-center items-center text-center transition-all ${
                  isFlipped ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200'
                }`}
              >
                <div className="absolute top-3 right-3 text-xs text-gray-400">Click to flip</div>

                {!isFlipped ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">Question:</p>
                    <p className="text-2xl font-semibold text-gray-900">{currentCard.front}</p>
                    {currentCard.difficulty && (
                      <Badge variant="outline" className="mt-4">
                        {currentCard.difficulty}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">Answer:</p>
                    <p className="text-2xl font-semibold text-blue-900">{currentCard.back}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-center flex-wrap">
            <Button variant="outline" size="sm" onClick={handleShuffle}>
              <Shuffle className="h-4 w-4 mr-2" />
              Shuffle
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="flex gap-3 justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {isFlipped && (
              <Button onClick={handleMarkComplete} className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Got it!
              </Button>
            )}

            {!isFlipped && !isCompleted && (
              <div className="text-center text-sm text-gray-500">Flip to reveal answer</div>
            )}

            {isCompleted && (
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            )}

            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="p-2 bg-gray-50 rounded">
              <p className="text-gray-600">Total</p>
              <p className="text-xl font-bold">{cards.length}</p>
            </div>
            <div className="p-2 bg-green-50 rounded">
              <p className="text-green-600">Completed</p>
              <p className="text-xl font-bold text-green-700">{completedCards.size}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded">
              <p className="text-blue-600">Remaining</p>
              <p className="text-xl font-bold text-blue-700">{cards.length - completedCards.size}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveFlashcards;
