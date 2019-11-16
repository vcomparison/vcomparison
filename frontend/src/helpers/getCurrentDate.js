export const getCurrentDate = (withTime = false) => {
    const unformattedLocalTime = new Date(Date.now()).toLocaleString();
    return withTime
            ? unformattedLocalTime.replace(/,/, '').replace(/\//g, '.')
            : unformattedLocalTime.split(',')[0].replace(/\//g, '.')
};
