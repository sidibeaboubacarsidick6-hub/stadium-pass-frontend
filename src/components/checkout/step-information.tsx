import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isValidEmail } from './format'
import type { CustomerInfo } from './types'

interface StepInformationProps {
  value: CustomerInfo
  onChange: (value: CustomerInfo) => void
  onBack: () => void
  onContinue: () => void
}

type FieldErrors = Partial<Record<keyof CustomerInfo, string>>

function validate(value: CustomerInfo): FieldErrors {
  const errors: FieldErrors = {}
  if (!value.firstName.trim()) errors.firstName = 'Le prénom est requis'
  if (!value.lastName.trim()) errors.lastName = 'Le nom est requis'
  if (!value.email.trim()) errors.email = "L'email est requis"
  else if (!isValidEmail(value.email)) errors.email = 'Adresse email invalide'
  if (value.phone && !/^[+\d\s().-]{8,}$/.test(value.phone)) errors.phone = 'Numéro invalide'
  if (!value.acceptedTerms) errors.acceptedTerms = 'Vous devez accepter les CGV'
  return errors
}

export function StepInformation({ value, onChange, onBack, onContinue }: StepInformationProps) {
  const [submitted, setSubmitted] = useState(false)
  const errors = validate(value)
  const visibleErrors = submitted ? errors : {}
  const isValid = Object.keys(errors).length === 0

  const update = <K extends keyof CustomerInfo>(key: K, next: CustomerInfo[K]) =>
    onChange({ ...value, [key]: next })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    if (isValid) onContinue()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold">Vos informations</h2>
        <p className="text-sm text-muted-foreground">Vos billets seront envoyés à cette adresse email.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="firstName"
          label="Prénom"
          required
          autoComplete="given-name"
          value={value.firstName}
          error={visibleErrors.firstName}
          onChange={(v) => update('firstName', v)}
        />
        <Field
          id="lastName"
          label="Nom"
          required
          autoComplete="family-name"
          value={value.lastName}
          error={visibleErrors.lastName}
          onChange={(v) => update('lastName', v)}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="vous@exemple.com"
          className="sm:col-span-2"
          value={value.email}
          error={visibleErrors.email}
          onChange={(v) => update('email', v)}
        />
        <Field
          id="phone"
          label="Téléphone"
          type="tel"
          autoComplete="tel"
          placeholder="+225 07 00 00 00 00"
          className="sm:col-span-2"
          value={value.phone}
          error={visibleErrors.phone}
          onChange={(v) => update('phone', v)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-3 rounded-xl bg-muted p-4">
          <Checkbox
            id="terms"
            checked={value.acceptedTerms}
            onCheckedChange={(checked) => update('acceptedTerms', checked === true)}
            aria-invalid={visibleErrors.acceptedTerms ? true : undefined}
            aria-describedby={visibleErrors.acceptedTerms ? 'terms-error' : undefined}
            className="mt-0.5 size-5 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
          />
          <Label htmlFor="terms" className="text-sm leading-relaxed font-normal">
            {"J'accepte les "}
            <a href="#" className="font-medium text-primary underline underline-offset-2">
              conditions générales de vente
            </a>
            {' *'}
          </Label>
        </div>
        {visibleErrors.acceptedTerms && (
          <p id="terms-error" className="text-sm text-destructive">
            {visibleErrors.acceptedTerms}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row">
        <Button type="button" variant="ghost" onClick={onBack} className="h-12 rounded-xl text-base sm:w-32">
          Retour
        </Button>
        <Button
          type="submit"
          disabled={!value.acceptedTerms}
          className="h-12 w-full sm:w-auto sm:flex-1 rounded-xl bg-orange text-base font-semibold text-white hover:bg-orange-dark"
        >
          Continuer
        </Button>
      </div>
    </form>
  )
}

interface FieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: string
  required?: boolean
  autoComplete?: string
  placeholder?: string
  className?: string
}

function Field({ id, label, value, onChange, error, type = 'text', required, autoComplete, placeholder, className }: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-orange" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-11 rounded-xl bg-card px-3.5 text-base md:text-sm"
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
