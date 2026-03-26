'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

export type FieldType = 'text' | 'email' | 'select' | 'radio' | 'custom' | 'summary';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string; description?: string }[];
  customRender?: (control: any, formData: any) => React.ReactNode;
}

export interface StepConfig {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  fields: FieldConfig[];
  schema?: z.ZodObject<any>;
}

export interface MultiStepCourseEnrollmentProps {
  steps: StepConfig[];
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  defaultValues?: any;
}

export const MultiStepCourseEnrollment: React.FC<MultiStepCourseEnrollmentProps> = ({
  steps,
  onSubmit,
  onCancel,
  defaultValues = {},
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Combine all schemas for a unified form or use 'any' schema to bypass full validation initially
  const combinedSchema = steps.reduce(
    (acc, step) => {
      if (step.schema) {
        return acc.merge(step.schema);
      }
      return acc;
    },
    z.object({})
  );

  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(combinedSchema),
    defaultValues,
    mode: 'onTouched',
  });

  const handleNext = async () => {
    const currentFields = steps[currentStep].fields.map((f) => f.name);
    
    // Only trigger validation for fields if they exist and we're not on the summary
    if (currentFields.length > 0 && currentFields[0] !== 'summary_flag') {
        const isValid = await trigger(currentFields);
        if (!isValid) return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const submitForm = (data: any) => {
    onSubmit(data);
  };

  const renderField = (field: FieldConfig) => {
    if (field.type === 'summary') {
      const formData = getValues();
      return (
        <div key={field.name} className="space-y-4 rounded-lg bg-muted p-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">Registration Summary</h4>
          {steps.map((st, i) => {
            if (i >= currentStep) return null;
            return (
              <div key={st.id} className="mb-4 last:mb-0">
                <h5 className="font-semibold text-foreground mb-2 pb-1 border-b">{st.title}</h5>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {st.fields.map((f) => {
                    if (f.type === 'summary' || f.type === 'custom') return null;
                    return (
                      <div key={f.name}>
                        <dt className="text-muted-foreground">{f.label}</dt>
                        <dd className="font-medium text-foreground">{formData[f.name] || '—'}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            );
          })}
        </div>
      );
    }

    if (field.type === 'custom' && field.customRender) {
      return (
        <div key={field.name} className="space-y-2">
          {field.customRender(control, getValues())}
        </div>
      );
    }

    return (
      <Controller
        key={field.name}
        control={control}
        name={field.name}
        render={({ field: controllerField, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor={field.name} className={fieldState.error ? 'text-destructive' : ''}>
              {field.label}
            </Label>
            
            {(field.type === 'text' || field.type === 'email') && (
              <Input
                {...controllerField}
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                className={fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
            )}

            {field.type === 'select' && field.options && (
              <Select onValueChange={controllerField.onChange} defaultValue={controllerField.value}>
                <SelectTrigger id={field.name} className={fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}>
                  <SelectValue placeholder={field.placeholder || 'Select an option...'} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {field.type === 'radio' && field.options && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {field.options.map((opt) => (
                  <Label
                    key={opt.value}
                    htmlFor={`${field.name}-${opt.value}`}
                    className={`flex flex-col items-start gap-2 rounded-xl border p-4 cursor-pointer transition-colors ${
                      controllerField.value === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`${field.name}-${opt.value}`}
                        className="sr-only"
                        {...controllerField}
                        value={opt.value}
                        checked={controllerField.value === opt.value}
                      />
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          controllerField.value === opt.value ? 'border-primary ring-1 ring-primary' : 'border-muted-foreground'
                      }`}>
                         {controllerField.value === opt.value && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <span className="font-semibold text-foreground">{opt.label}</span>
                    </div>
                    {opt.description && (
                      <span className="text-xs text-muted-foreground pl-6">{opt.description}</span>
                    )}
                  </Label>
                ))}
              </div>
            )}

            {fieldState.error && (
              <p className="text-sm font-medium text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="h-4 w-4" />
                {fieldState.error.message as string}
              </p>
            )}
          </div>
        )}
      />
    );
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-muted/60 bg-background/95 backdrop-blur-sm relative overflow-hidden">
      {/* Progress Bar (Top) */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-muted">
         <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ ease: "easeInOut", duration: 0.4 }}
         />
      </div>

      <CardHeader className="pb-6 pt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                {steps[currentStep].icon || <CheckCircle2 className="h-5 w-5" />}
             </div>
             <div>
               <CardTitle className="text-2xl font-bold text-foreground">
                 {steps[currentStep].title}
               </CardTitle>
               <CardDescription className="text-sm text-muted-foreground mt-1">
                 {steps[currentStep].description || `Step ${currentStep + 1} of ${steps.length}`}
               </CardDescription>
             </div>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {currentStep + 1} / {steps.length}
          </div>
        </div>
        
        {/* Visual Steps Indicator */}
        <div className="flex items-center gap-2 max-w-sm">
           {steps.map((s, index) => (
             <React.Fragment key={s.id}>
               <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all ${
                 index < currentStep 
                 ? 'bg-primary border-primary text-primary-foreground' 
                 : index === currentStep 
                    ? 'border-primary text-primary' 
                    : 'border-muted text-muted-foreground'
               }`}>
                 {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
               </div>
               {index < steps.length - 1 && (
                 <div className={`h-1 flex-1 rounded-full transition-all ${
                   index < currentStep ? 'bg-primary' : 'bg-muted'
                 }`} />
               )}
             </React.Fragment>
           ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative overflow-hidden min-h-[280px]">
          <AnimatePresence mode="wait" custom={currentStep}>
            <motion.div
              key={currentStep}
              className="w-full h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="space-y-6">
                {steps[currentStep].fields.map(renderField)}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
        <Button
          type="button"
          variant="outline"
          onClick={currentStep === 0 ? onCancel : handlePrev}
        >
          {currentStep === 0 ? 'Cancel' : (
            <>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </>
          )}
        </Button>
        
        {currentStep < steps.length - 1 ? (
          <Button type="button" onClick={handleNext}>
            Continue <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            type="button" 
            onClick={handleSubmit(submitForm)} 
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSubmitting ? 'Processing...' : 'Confirm Enrollment'} 
            {!isSubmitting && <CheckCircle2 className="ml-2 h-4 w-4" />}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
