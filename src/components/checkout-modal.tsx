'use client';

import type React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, CreditCard, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import WalletConnect from './wallet-connect';

interface CheckoutModalProps {
  children: React.ReactNode;
  courseName: string;
  coursePrice: number;
  courseImage?: string;
}

export default function CheckoutModal({
  children,
  courseName,
  coursePrice,
  courseImage = '/placeholder.svg?height=80&width=80&text=Course',
}: CheckoutModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // XLM price (mock conversion)
  const xlmPrice = (coursePrice / 0.12).toFixed(2); // Assuming 1 XLM = $0.12

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // In a real app, this would integrate with a payment processor:
      // const response = await fetch('/api/payments/process', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //         courseId: courseId,
      //         amount: coursePrice,
      //         paymentMethod: paymentMethod
      //     })
      // });
      // const result = await response.json();
      setIsProcessing(false);
      setIsComplete(true);

      // Auto-close after showing success message
      setTimeout(() => {
        setIsOpen(false);
        setIsComplete(false);
      }, 3000);
    } catch (error) {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {!isComplete ? (
          <>
            <DialogHeader>
              <DialogTitle>Complete your purchase</DialogTitle>
              <DialogDescription>
                Choose your preferred payment method to enroll in this course.
                <span className="block mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  🚧 Demo Mode: This is a demonstration. No real payments will
                  be processed.
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-4 rounded-lg border p-4 my-4">
              <Image
                src={courseImage || '/placeholder.svg'}
                alt={courseName}
                width={64}
                height={64}
                className="h-16 w-16 rounded-md object-cover"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              <div>
                <h3 className="font-medium">{courseName}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Lifetime access</span>
                  <span>•</span>
                  <span>Certificate included</span>
                </div>
                <p className="mt-1 text-lg font-bold">
                  ${coursePrice.toFixed(2)}
                </p>
              </div>
            </div>

            <Tabs defaultValue="crypto" onValueChange={setPaymentMethod}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="crypto">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>Crypto</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="card">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Card</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="crypto" className="space-y-4 pt-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        Pay with Stellar (XLM)
                      </span>
                    </div>
                    <span className="font-bold">{xlmPrice} XLM</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Connect your Stellar wallet to make a secure payment
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button variant="outline" disabled>
                    Connect Wallet (Demo)
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Payments are processed on the Stellar blockchain</p>
                  <p>Current rate: 1 XLM ≈ $0.12</p>
                </div>
              </TabsContent>

              <TabsContent value="card" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-2" />

            <div className="flex items-center justify-between">
              <span className="font-medium">Total:</span>
              <span className="text-lg font-bold">
                {paymentMethod === 'crypto'
                  ? `${xlmPrice} XLM`
                  : `$${coursePrice.toFixed(2)}`}
              </span>
            </div>

            <DialogFooter className="mt-4">
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Complete Purchase</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
            >
              <Check className="h-8 w-8 text-green-600" />
            </motion.div>
            <h2 className="mb-2 text-xl font-bold">Demo Payment Successful!</h2>
            <p className="mb-6 text-center text-muted-foreground">
              Thank you for your purchase. You now have access to &quot;
              {courseName}
              &quot;. This was a demonstration. In a real application, you would
              now have access to "{courseName}".
            </p>
            <Button>
              <div className="flex items-center gap-2">
                <span>Start Learning</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
