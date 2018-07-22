import styledComponents, { ThemedStyledFunction } from 'styled-components';
import { Theme } from '@material-ui/core/styles'
export { Mounted } from './react'

export interface StyledProps {
    className?: string
}

export interface ThemedProps {
    theme?: Theme
}

// used to kinda cast a theme from Props to non-optional type with fallback to default empty theme
// this is used since: 
//    1. I cannot properly resolve Typings in a bunch of higher order components (like redux) 
//    2. Gives a sound fallback in case we haven't used withTheme but still have theme logic present in our styled components css
export const safe = (theme?: Theme) => <P>(selector: (theme: Theme) => P, defaultValue: P): any => theme ? selector(theme) : defaultValue

export interface StyledThemedProps {
    className?: string
    theme?: Theme
}

export function withProps<U>() {
    return <P, T, O>(
        fn: ThemedStyledFunction<P, T, O>
    ): ThemedStyledFunction<P & U, T, O & U> => fn as ThemedStyledFunction<P & U, T, O & U>
}

export const hexToRgb = (hex: string) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export const hexWithOpacity = (hex: string, opacity: number): string => {
    const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 }
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
}