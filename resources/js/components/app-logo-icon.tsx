import type { ImgHTMLAttributes } from 'react';
import logo from '../../../public/thouraya-logo.png';

interface AppLogoIconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
    alt?: string;
}

export default function AppLogoIcon({ 
    alt = 'Thouraya Albilad Trading Company Logo',
    className = '',
    ...props 
}: AppLogoIconProps) {
    return (
        <img
            src={logo}
            alt={alt}
            loading="eager"
            decoding="async"
            className={`select-none object-contain ${className}`}
            draggable={false}
            {...props}
        />
    );
}