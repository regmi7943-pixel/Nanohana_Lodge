import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    
    // Defer the initial check to run after mounting has completed, satisfying ESLint
    const timer = setTimeout(() => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }, 0)
    
    return () => {
      mql.removeEventListener("change", onChange)
      clearTimeout(timer)
    }
  }, [])

  return isMobile
}
