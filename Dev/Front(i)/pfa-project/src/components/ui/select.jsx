"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "../../lib/utils"

const Select = ({ children, defaultValue, value, onValueChange, className }) => {
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || "")
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue)
    if (onValueChange) {
      onValueChange(newValue)
    }
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={selectRef} className={cn("relative", className)}>
      {React.Children.map(children, (child) => {
        if (child.type.displayName === "SelectTrigger") {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            selectedValue,
          })
        }
        if (child.type.displayName === "SelectContent") {
          return isOpen
            ? React.cloneElement(child, {
                onValueChange: handleValueChange,
                selectedValue,
              })
            : null
        }
        return child
      })}
    </div>
  )
}

const SelectTrigger = ({ className, children, onClick, selectedValue }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {React.Children.map(children, (child) => {
        if (child.type.displayName === "SelectValue") {
          return React.cloneElement(child, { selectedValue })
        }
        return child
      })}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 opacity-50"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  )
}

SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, selectedValue }) => {
  return <span>{selectedValue || placeholder}</span>
}

SelectValue.displayName = "SelectValue"

const SelectContent = ({ className, children, onValueChange, selectedValue }) => {
  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80",
        className,
      )}
      style={{ width: "100%", top: "calc(100% + 5px)" }}
    >
      <div className="w-full p-1">
        {React.Children.map(children, (child) => {
          if (child.type.displayName === "SelectItem") {
            return React.cloneElement(child, {
              onSelect: () => onValueChange(child.props.value),
              isSelected: child.props.value === selectedValue,
            })
          }
          return child
        })}
      </div>
    </div>
  )
}

SelectContent.displayName = "SelectContent"

const SelectItem = ({ className, children, value, onSelect, isSelected }) => {
  return (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        isSelected ? "bg-accent text-accent-foreground" : "",
        className,
      )}
      onClick={onSelect}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      <span>{children}</span>
    </div>
  )
}

SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
