declare global {
    interface NumberConstructor {
        /**
         * Converts a string to a floating-point number.
         * @param {string} string A string that contains a floating-point number.
         * @param {string} defaultValue A value to be returned if the conversion does not succeed.
         */
        tryParseFloat(string: string, defaultValue?: number): number;

        /**
         * Attempt to convert a string to an integer. Returns a default value if the conversion does not succeed.
         * @param string A string to convert into a number.
         * @param defaultValue A value to be returned if the conversion does not succeed.
         * @param radix A value between 2 and 36 that specifies the base of the number in numString.
         * If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal.
         * All other strings are considered decimal.
         */
        tryParseInt(string: string, defaultValue?: number, radix?: number): number;
    }
}

Number.tryParseFloat = (value: string, defaultValue = 0): number => {
    try {
        if (!value) return defaultValue;
        if (!value.length) return defaultValue;
        if (Number.isNaN(value)) return defaultValue;

        return Number.parseFloat(value);
    } catch (error) { console.error(error); }

    return defaultValue;
};

Number.tryParseInt = (value: string, defaultValue = 0, radix = 10): number => {
    try {
        if (!value) return defaultValue;
        if (!value.length) return defaultValue;
        if (Number.isNaN(value)) return defaultValue;

        return Number.parseInt(value, radix);
    } catch (error) { console.error(error); }

    return defaultValue;
};

export {};
