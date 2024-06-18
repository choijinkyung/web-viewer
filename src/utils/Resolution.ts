import { useMediaQuery } from 'react-responsive'

export const isBigScreen = ()=> {
    const isBigScreen = useMediaQuery({ minWidth: 1921, maxWidth: 7680  })
    return isBigScreen;
}
export const isSmallScreen = ()=> {
    const isSmallScreen = useMediaQuery({ minWidth: 0, maxWidth: 1280 })
    return isSmallScreen;
}
export const isFHD = ()=> {
    const isFHD = useMediaQuery({ minWidth: 1281, maxWidth: 1920  })
    return isFHD;
}
export const isHD = ()=> {
    const isHD = useMediaQuery({ minWidth: 961, maxWidth: 1280  })
    return isHD;
}
export const isQHD = ()=> {
    const isQHD = useMediaQuery({ minWidth: 641, maxWidth: 960  })
    return isQHD;
}
export const isNHD = ()=> {
    const isNHD = useMediaQuery({ minWidth: 0, maxWidth: 640  })
    return isNHD;
}
