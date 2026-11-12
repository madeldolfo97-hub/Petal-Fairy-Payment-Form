import { supabase } from "./supabase"
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  ReactNode,
  useRef,
  useState,
} from "react"

type FormData = {
  fullName: string
  contact: string
  facebook: string
  orderId: string
  description: string
  totalAmount: string
  paymentMethod: string
  amountPaid: string
  reference: string
  paymentDate: string
  notes: string
  confirmed: boolean
}

const initialForm: FormData = {
  fullName: "",
  contact: "",
  facebook: "",
  orderId: "",
  description: "",
  totalAmount: "",
  paymentMethod: "",
  amountPaid: "",
  reference: "",
  paymentDate: "",
  notes: "",
  confirmed: false,
}

const icons = {
  person: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0" />,
  phone: (
    <path d="M8.2 3.5 5.5 4.7c-1.1.5-.9 3 .7 6.3s3.8 6.1 6.5 7.4c2.7 1.2 5 .8 5.5-.4l1-2.6-4.7-2.2-1.1 2c-1.7-.8-4-3.2-4.8-5.1l2-1.2-2.4-5.4Z" />
  ),
  social: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 8.5h-1.3c-.8 0-1.2.5-1.2 1.3V20M9 13h6" />
    </>
  ),
  tag: <path d="M4 12.5 11.5 5H18l1 1v6.5L11.5 20 4 12.5Zm10-4h.01" />,
  flower: (
    <>
      <circle cx="12" cy="11" r="2" />
      <path d="M12 9c-3-5-7-2-5 1-4 1-2 5 1 4 0 4 4 4 5 1 3 3 6 0 4-3 4-2 3-6-1-5-1-4-4-5-4-2Z" />
      <path d="M12 16v5" />
    </>
  ),
  peso: (
    <>
      <path d="M8 20V4h5a4 4 0 0 1 0 8H8M6 7h9M6 10h9" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9h18M7 15h3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4m8-4v4M3 10h18M8 14h.01m4 0h.01m4 0h.01m-8 3h.01m4 0h.01" />
    </>
  ),
  pencil: (
    <path d="m4 20 4.2-1 10.3-10.3a2.1 2.1 0 0 0-3-3L5.2 16 4 20Zm10-13 3 3" />
  ),
  upload: (
    <>
      <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
      <path d="M5 14H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-1" />
    </>
  ),
  send: (
    <>
      <path d="m3 11 18-8-8 18-2-8-8-2Z" />
      <path d="m11 13 5-5" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
}

function Icon({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function Tulip({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 92"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M35 44c-14-3-19-15-15-30 8 2 13 7 16 14 3-8 8-13 17-17 3 17-4 29-18 33Z"
        fill="#eea7aa"
      />
      <path
        d="M36 28C31 18 26 13 20 14c1 11 5 20 15 29M37 28c5-10 10-15 16-17 0 13-5 25-18 33"
        stroke="#dc858b"
        strokeWidth="1.4"
      />
      <path
        d="M35 43c1 15 0 29-3 44"
        stroke="#47674e"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M34 63C23 52 13 54 11 57c5 9 13 13 22 12" fill="#759173" />
      <path d="M34 72c8-10 17-11 23-9-4 9-12 13-24 14" fill="#90a487" />
    </svg>
  )
}

function Sparkles() {
  return (
    <div className="sparkles" aria-hidden="true">
      <span>✦</span>
      <span>·</span>
      <span>✧</span>
      <span>·</span>
      <span>✦</span>
    </div>
  )
}

function SectionCard({
  number,
  title,
  subtitle,
  children,
}: {
  number: string
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <section className="form-section">
      <div className="section-heading">
        <span className="section-number">{number}</span>
        <Tulip className="section-tulip" />
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

type FieldProps = {
  label: string
  name: keyof FormData
  value: string
  placeholder: string
  icon: ReactNode
  required?: boolean
  type?: string
  error?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function Field({
  label,
  name,
  value,
  placeholder,
  icon,
  required,
  type = "text",
  error,
  onChange,
}: FieldProps) {
  return (
    <label className={`field ${error ? "field-error" : ""}`}>
      <span className="field-label">
        {label}
        {required && <b> *</b>}
      </span>
      <span className="input-wrap">
        <Icon>{icon}</Icon>
        <input
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          aria-invalid={!!error}
        />
      </span>
      {error && <span className="error-message">{error}</span>}
    </label>
  )
}

const paymentMethods = [
  { id: "GCash", mark: <span className="gcash-mark">G</span>, label: "GCash" },
  { id: "Maya", mark: <span className="maya-mark">maya</span>, label: "Maya" },
  {
    id: "Bank Transfer",
    mark: <span className="bank-mark">♜</span>,
    label: "Bank Transfer",
  },
]

export default function App() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [receipt, setReceipt] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const updateField = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: "" }))
  }

  const setFile = (file?: File) => {
    if (!file) return
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setErrors((current) => ({
        ...current,
        receipt: "Please upload a JPG or PNG image.",
      }))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({
        ...current,
        receipt: "File size must be 5MB or less.",
      }))
      return
    }
    setReceipt(file)
    setErrors((current) => ({ ...current, receipt: "" }))
  }

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setDragging(false)
    setFile(event.dataTransfer.files[0])
  }

  

const submit = async (event: FormEvent) => {
  event.preventDefault()

  const nextErrors: Record<string, string> = {}

  const required: Array<[keyof FormData, string]> = [
    ["fullName", "Please enter your full name."],
    ["contact", "Please enter your contact number."],
    ["orderId", "Please enter your order ID."],
    ["paymentMethod", "Please select a payment method."],
    ["amountPaid", "Please enter the amount paid."],
    ["reference", "Please enter the reference number."],
    ["paymentDate", "Please select the payment date."],
  ]

  required.forEach(([key, message]) => {
    if (!String(form[key]).trim()) nextErrors[key] = message
  })

  if (!receipt) {
    nextErrors.receipt = "Please attach your proof of payment."
  }

  if (!form.confirmed) {
    nextErrors.confirmed = "Please confirm your information."
  }

  const amount = Number(form.amountPaid.replace(/[₱,\s]/g, ""))

  if (form.amountPaid.trim() && (!Number.isFinite(amount) || amount <= 0)) {
    nextErrors.amountPaid = "Please enter a valid amount."
  }

  setErrors(nextErrors)

  if (Object.keys(nextErrors).length > 0) return

  try {
    const { error } = await supabase
      .from("payments")
      .insert([
        {
          customer_name: form.fullName,
          amount: amount,
          payment_method: form.paymentMethod,
          reference_number: form.reference,
          status: "pending",
        },
      ])

    if (error) throw error

    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: "smooth" })

  } catch (error) {
    console.error("Supabase submission error:", error)

    alert(
      error instanceof Error
        ? error.message
        : "Unable to save payment."
    )
  }
}

  const resetForm = () => {
    setForm(initialForm)
    setReceipt(null)
    setErrors({})
    setSubmitted(false)
    if (fileInput.current) fileInput.current.value = ""
  }

  return (
    <main className="page-shell">
      <img
        className="exact-botanical exact-top-left"
        src="/assets/botanical-top-left.png"
        alt=""
      />
      <img
        className="exact-botanical exact-top-right"
        src="/assets/botanical-top-right.png"
        alt=""
      />
      <img
        className="exact-botanical exact-bottom-left"
        src="/assets/botanical-bottom-left.png"
        alt=""
      />
      <img
        className="exact-botanical exact-bottom-right"
        src="/assets/botanical-bottom-right.png"
        alt=""
      />
      <div className="top-wash" aria-hidden="true" />
      <Sparkles />

      <div className="content">
        <header className="brand-header">
          <div className="brand-lockup">
            <img
              className="brand-logo"
              src="/assets/petal-fairy-logo.png"
              alt="Petal Fairy"
            />
          </div>
          <p className="tagline">
            Small steps
            <br />
            make big blooms.
          </p>
          <div className="social-line">
            <span className="social-icon">◎</span> petalfairy___
            <i />
            <span className="social-icon">f</span> Petal Fairy
          </div>
          <h1>Payment Form</h1>
          <p className="intro">
            Kindly fill out the details below to submit your payment.{" "}
            <span>♡</span>
          </p>
          <div className="floral-rule">
            <i />
            <span>❀</span>
            <i />
          </div>
        </header>

        {submitted ? (
          <section className="success-card" aria-live="polite">
            <div className="success-icon">
              <Icon>{icons.check}</Icon>
            </div>
            <span className="eyebrow">Payment submitted</span>
            <h2>Thank you, {form.fullName.split(" ")[0]}!</h2>
            <p>
              We’ve received your payment details for order{" "}
              <strong>{form.orderId}</strong>. Our team will verify your receipt
              and get in touch with you soon.
            </p>
            <button
              type="button"
              className="secondary-button"
              onClick={resetForm}
            >
              Submit another payment
            </button>
            <Tulip className="success-tulip" />
          </section>
        ) : (
          <form onSubmit={submit} noValidate>
            <SectionCard
              number="1"
              title="Customer Information"
              subtitle="Let us know who you are."
            >
              <div className="grid grid-three">
                <Field
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  placeholder="e.g. Maria Santos"
                  icon={icons.person}
                  required
                  error={errors.fullName}
                  onChange={updateField}
                />
                <Field
                  label="Contact Number"
                  name="contact"
                  value={form.contact}
                  placeholder="e.g. 0917 123 4567"
                  icon={icons.phone}
                  required
                  error={errors.contact}
                  onChange={updateField}
                />
                <Field
                  label="Facebook Account"
                  name="facebook"
                  value={form.facebook}
                  placeholder="e.g. facebook.com/username"
                  icon={icons.social}
                  onChange={updateField}
                />
              </div>
            </SectionCard>

            <SectionCard
              number="2"
              title="Order Reference"
              subtitle="Help us identify your order."
            >
              <div className="grid order-grid">
                <Field
                  label="Order ID"
                  name="orderId"
                  value={form.orderId}
                  placeholder="e.g. PF-2025-001"
                  icon={icons.tag}
                  required
                  error={errors.orderId}
                  onChange={updateField}
                />
                <Field
                  label="Bouquet / Order Description"
                  name="description"
                  value={form.description}
                  placeholder="e.g. Customized bouquet"
                  icon={icons.flower}
                  onChange={updateField}
                />
                <Field
                  label="Total Order Amount"
                  name="totalAmount"
                  value={form.totalAmount}
                  placeholder="e.g. ₱800"
                  icon={icons.peso}
                  onChange={updateField}
                />
              </div>
            </SectionCard>

            <SectionCard
              number="3"
              title="Payment Details"
              subtitle="Enter your payment information."
            >
              <div className="payment-top">
                <fieldset
                  className={`payment-choice ${
                    errors.paymentMethod ? "choice-error" : ""
                  }`}
                >
                  <legend>
                    Payment Method <b>*</b>
                  </legend>
                  <div className="method-grid">
                    {paymentMethods.map((method) => (
                      <label
                        className={`method-card ${
                          form.paymentMethod === method.id ? "selected" : ""
                        }`}
                        key={method.id}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={form.paymentMethod === method.id}
                          onChange={updateField}
                        />
                        <span className="radio-dot" />
                        {method.mark}
                        <span>{method.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.paymentMethod && (
                    <span className="error-message">
                      {errors.paymentMethod}
                    </span>
                  )}
                </fieldset>
                <Field
                  label="Amount Paid"
                  name="amountPaid"
                  value={form.amountPaid}
                  placeholder="e.g. ₱800"
                  icon={icons.peso}
                  required
                  error={errors.amountPaid}
                  onChange={updateField}
                />
              </div>
              <div className="grid grid-two">
                <Field
                  label="Reference Number"
                  name="reference"
                  value={form.reference}
                  placeholder="e.g. 1234 5678 9012"
                  icon={icons.card}
                  required
                  error={errors.reference}
                  onChange={updateField}
                />
                <Field
                  label="Date of Payment"
                  name="paymentDate"
                  value={form.paymentDate}
                  placeholder="mm/dd/yyyy"
                  type="date"
                  icon={icons.calendar}
                  required
                  error={errors.paymentDate}
                  onChange={updateField}
                />
              </div>
            </SectionCard>

            <SectionCard
              number="4"
              title="Proof of Payment"
              subtitle="Upload a photo of your payment receipt or screenshot."
            >
              <div className="grid proof-grid">
                <div>
                  <button
                    type="button"
                    className={`upload-zone ${dragging ? "dragging" : ""} ${
                      errors.receipt ? "upload-error" : ""
                    }`}
                    onClick={() => fileInput.current?.click()}
                    onDragOver={(event) => {
                      event.preventDefault()
                      setDragging(true)
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                  >
                    {receipt ? (
                      <>
                        <span className="file-check">
                          <Icon>{icons.check}</Icon>
                        </span>
                        <strong>{receipt.name}</strong>
                        <small>
                          {(receipt.size / 1024 / 1024).toFixed(2)} MB · Click
                          to replace
                        </small>
                      </>
                    ) : (
                      <>
                        <span className="upload-icon">
                          <Icon>{icons.upload}</Icon>
                        </span>
                        <strong>
                          Click to upload <span>or drag and drop</span>
                        </strong>
                        <small>JPG, PNG (Max 5MB)</small>
                      </>
                    )}
                  </button>
                  <input
                    ref={fileInput}
                    className="sr-only"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(event) => setFile(event.target.files?.[0])}
                  />
                  {errors.receipt && (
                    <span className="error-message">{errors.receipt}</span>
                  )}
                </div>
                <label className="field notes-field">
                  <span className="field-label">
                    Additional Notes <em>(optional)</em>
                  </span>
                  <span className="textarea-wrap">
                    <Icon>{icons.pencil}</Icon>
                    <textarea
                      name="notes"
                      value={form.notes}
                      placeholder="e.g. Special instructions or other details..."
                      maxLength={200}
                      onChange={updateField}
                    />
                    <small>{form.notes.length}/200</small>
                  </span>
                </label>
              </div>
            </SectionCard>

            <SectionCard
              number="5"
              title="Confirmation"
              subtitle="Please make sure all information is correct before submitting."
            >
              <label
                className={`confirm-row ${
                  errors.confirmed ? "choice-error" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.confirmed}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      confirmed: event.target.checked,
                    }))
                    if (errors.confirmed)
                      setErrors((current) => ({ ...current, confirmed: "" }))
                  }}
                />
                <span className="custom-check">
                  <Icon>{icons.check}</Icon>
                </span>
                <span>
                  I confirm that the information I provided is true and correct.
                </span>
              </label>
              {errors.confirmed && (
                <span className="error-message confirm-error">
                  {errors.confirmed}
                </span>
              )}
            </SectionCard>

            <div className="submit-area">
              <button className="submit-button" type="submit">
                <Icon>{icons.send}</Icon>
                Submit Payment
                <span>♡</span>
              </button>
              <div className="thank-you">
                <i />
                Thank you for choosing Petal Fairy! ♡<i />
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="bottom-waves" aria-hidden="true" />
      <div className="bottom-sparkles" aria-hidden="true">
        ✦　·　✧　　　　　　　　　✦　·　✧
      </div>
    </main>
  )
}
