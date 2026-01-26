import * as React from "react"
import { cn } from "@/lib/utils"

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple"
  collapsible?: boolean
  defaultValue?: string
}

interface AccordionContextValue {
  type: "single" | "multiple"
  openItems: Set<string>
  onToggle: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

function Accordion({
  className,
  type = "single",
  collapsible = true,
  defaultValue,
  children,
  ...props
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(
    defaultValue ? new Set([defaultValue]) : new Set()
  )

  const onToggle = React.useCallback((value: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(value)) {
        if (collapsible) {
          next.delete(value)
        }
      } else {
        if (type === "single") {
          next.clear()
        }
        next.add(value)
      }
      return next
    })
  }, [type, collapsible])

  return (
    <AccordionContext.Provider value={{ type, openItems, onToggle }}>
      <div className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

function AccordionItem({ className, value, children, ...props }: AccordionItemProps) {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error("AccordionItem must be used within Accordion")

  const isOpen = context.openItems.has(value)

  return (
    <div
      className={cn(
        "border border-border rounded-lg overflow-hidden",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, isOpen } as any)
        }
        return child
      })}
    </div>
  )
}

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string
  isOpen?: boolean
}

function AccordionTrigger({
  className,
  value,
  isOpen,
  children,
  ...props
}: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error("AccordionTrigger must be used within Accordion")

  const handleClick = () => {
    if (value) {
      context.onToggle(value)
    }
  }

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between px-4 py-4 text-left font-medium transition-all hover:bg-muted/50",
        isOpen && "[&>svg]:rotate-180",
        className
      )}
      onClick={handleClick}
      data-state={isOpen ? "open" : "closed"}
      aria-expanded={isOpen}
      {...props}
    >
      {children}
      <svg
        className="h-4 w-4 shrink-0 transition-transform duration-200"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  )
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  isOpen?: boolean
}

function AccordionContent({
  className,
  value,
  isOpen,
  children,
  ...props
}: AccordionContentProps) {
  if (!isOpen) return null

  return (
    <div
      className={cn(
        "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      <div className="px-4 pb-4 pt-0 text-muted-foreground">
        {children}
      </div>
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
