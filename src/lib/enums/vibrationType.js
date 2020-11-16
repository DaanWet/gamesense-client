'use strict';
/**
 * @see https://github.com/SteelSeries/gamesense-sdk/blob/master/doc/api/json-handlers-tactile.md#reference-sections---ti-predefined-vibrations
 * @enum {string}
 */
gamesense.VibrationType = {
    CUSTOM: 'custom',
    STRONGCLICK_100: 'ti_predefined_strongclick_100',
    STRONGCLICK_60: 'ti_predefined_strongclick_60',
    STRONGCLICK_30: 'ti_predefined_strongclick_30',
    SHARPCLICK_100: 'ti_predefined_sharpclick_100',
    SHARPCLICK_60: 'ti_predefined_sharpclick_60',
    SHARPCLICK_30: 'ti_predefined_sharpclick_30',
    SOFTBUMP_100: 'ti_predefined_softbump_100',
    SOFTBUMP_60: 'ti_predefined_softbump_60',
    SOFTBUMP_30: 'ti_predefined_softbump_30',
    DOUBLECLICK_100: 'ti_predefined_doubleclick_100',
    DOUBLECLICK_60: 'ti_predefined_doubleclick_60',
    TRIPLECLICK_100: 'ti_predefined_tripleclick_100',
    SOFTFUZZ_60: 'ti_predefined_softfuzz_60',
    STRONGBUZZ_100: 'ti_predefined_strongbuzz_100',
    BUZZALERT750MS: 'ti_predefined_buzzalert750ms',
    BUZZALERT1000MS: 'ti_predefined_buzzalert1000ms',
    STRONGCLICK1_100: 'ti_predefined_strongclick1_100',
    STRONGCLICK2_80: 'ti_predefined_strongclick2_80',
    STRONGCLICK3_60: 'ti_predefined_strongclick3_60',
    STRONGCLICK4_30: 'ti_predefined_strongclick4_30',
    MEDIUMCLICK1_100: 'ti_predefined_mediumclick1_100',
    MEDIUMCLICK2_80: 'ti_predefined_mediumclick2_80',
    MEDIUMCLICK3_60: 'ti_predefined_mediumclick3_60',
    SHARPTICK1_100: 'ti_predefined_sharptick1_100',
    SHARPTICK2_80: 'ti_predefined_sharptick2_80',
    SHARPTICK3_60: 'ti_predefined_sharptick3_60',
    SHORTDOUBLECLICKSTRONG1_100: 'ti_predefined_shortdoubleclickstrong1_100',
    SHORTDOUBLECLICKSTRONG2_80: 'ti_predefined_shortdoubleclickstrong2_80',
    SHORTDOUBLECLICKSTRONG3_60: 'ti_predefined_shortdoubleclickstrong3_60',
    SHORTDOUBLECLICKSTRONG4_30: 'ti_predefined_shortdoubleclickstrong4_30',
    SHORTDOUBLECLICKMEDIUM1_100: 'ti_predefined_shortdoubleclickmedium1_100',
    SHORTDOUBLECLICKMEDIUM2_80: 'ti_predefined_shortdoubleclickmedium2_80',
    SHORTDOUBLECLICKMEDIUM3_60: 'ti_predefined_shortdoubleclickmedium3_60',
    SHORTDOUBLESHARPTICK1_100: 'ti_predefined_shortdoublesharptick1_100',
    SHORTDOUBLESHARPTICK2_80: 'ti_predefined_shortdoublesharptick2_80',
    SHORTDOUBLESHARPTICK3_60: 'ti_predefined_shortdoublesharptick3_60',
    LONGDOUBLESHARPCLICKSTRONG1_100: 'ti_predefined_longdoublesharpclickstrong1_100',
    LONGDOUBLESHARPCLICKSTRONG2_80: 'ti_predefined_longdoublesharpclickstrong2_80',
    LONGDOUBLESHARPCLICKSTRONG3_60: 'ti_predefined_longdoublesharpclickstrong3_60',
    LONGDOUBLESHARPCLICKSTRONG4_30: 'ti_predefined_longdoublesharpclickstrong4_30',
    LONGDOUBLESHARPCLICKMEDIUM1_100: 'ti_predefined_longdoublesharpclickmedium1_100',
    LONGDOUBLESHARPCLICKMEDIUM2_80: 'ti_predefined_longdoublesharpclickmedium2_80',
    LONGDOUBLESHARPCLICKMEDIUM3_60: 'ti_predefined_longdoublesharpclickmedium3_60',
    LONGDOUBLESHARPTICK1_100: 'ti_predefined_longdoublesharptick1_100',
    LONGDOUBLESHARPTICK2_80: 'ti_predefined_longdoublesharptick2_80',
    LONGDOUBLESHARPTICK3_60: 'ti_predefined_longdoublesharptick3_60',
    BUZZ1_100: 'ti_predefined_buzz1_100',
    BUZZ2_80: 'ti_predefined_buzz2_80',
    BUZZ3_60: 'ti_predefined_buzz3_60',
    BUZZ4_40: 'ti_predefined_buzz4_40',
    BUZZ5_20: 'ti_predefined_buzz5_20',
    PULSINGSTRONG1_100: 'ti_predefined_pulsingstrong1_100',
    PULSINGSTRONG2_60: 'ti_predefined_pulsingstrong2_60',
    PULSINGMEDIUM1_100: 'ti_predefined_pulsingmedium1_100',
    PULSINGMEDIUM2_60: 'ti_predefined_pulsingmedium2_60',
    PULSINGSHARP1_100: 'ti_predefined_pulsingsharp1_100',
    PULSINGSHARP2_60: 'ti_predefined_pulsingsharp2_60',
    TRANSITIONCLICK1_100: 'ti_predefined_transitionclick1_100',
    TRANSITIONCLICK2_80: 'ti_predefined_transitionclick2_80',
    TRANSITIONCLICK3_60: 'ti_predefined_transitionclick3_60',
    TRANSITIONCLICK4_40: 'ti_predefined_transitionclick4_40',
    TRANSITIONCLICK5_20: 'ti_predefined_transitionclick5_20',
    TRANSITIONCLICK6_10: 'ti_predefined_transitionclick6_10',
    TRANSITIONHUM1_100: 'ti_predefined_transitionhum1_100',
    TRANSITIONHUM2_80: 'ti_predefined_transitionhum2_80',
    TRANSITIONHUM3_60: 'ti_predefined_transitionhum3_60',
    TRANSITIONHUM4_40: 'ti_predefined_transitionhum4_40',
    TRANSITIONHUM5_20: 'ti_predefined_transitionhum5_20',
    TRANSITIONHUM6_10: 'ti_predefined_transitionhum6_10',
    TRANSITIONRAMPDOWNLONGSMOOTH1_100TO0: 'ti_predefined_transitionrampdownlongsmooth1_100to0',
    TRANSITIONRAMPDOWNLONGSMOOTH2_100TO0: 'ti_predefined_transitionrampdownlongsmooth2_100to0',
    TRANSITIONRAMPDOWNMEDIUMSMOOTH1_100TO0: 'ti_predefined_transitionrampdownmediumsmooth1_100to0',
    TRANSITIONRAMPDOWNMEDIUMSMOOTH2_100TO0: 'ti_predefined_transitionrampdownmediumsmooth2_100to0',
    TRANSITIONRAMPDOWNSHORTSMOOTH1_100TO0: 'ti_predefined_transitionrampdownshortsmooth1_100to0',
    TRANSITIONRAMPDOWNSHORTSMOOTH2_100TO0: 'ti_predefined_transitionrampdownshortsmooth2_100to0',
    TRANSITIONRAMPDOWNLONGSHARP1_100TO0: 'ti_predefined_transitionrampdownlongsharp1_100to0',
    TRANSITIONRAMPDOWNLONGSHARP2_100TO0: 'ti_predefined_transitionrampdownlongsharp2_100to0',
    TRANSITIONRAMPDOWNMEDIUMSHARP1_100TO0: 'ti_predefined_transitionrampdownmediumsharp1_100to0',
    TRANSITIONRAMPDOWNMEDIUMSHARP2_100TO0: 'ti_predefined_transitionrampdownmediumsharp2_100to0',
    TRANSITIONRAMPDOWNSHORTSHARP1_100TO0: 'ti_predefined_transitionrampdownshortsharp1_100to0',
    TRANSITIONRAMPDOWNSHORTSHARP2_100TO0: 'ti_predefined_transitionrampdownshortsharp2_100to0',
    TRANSITIONRAMPUPLONGSMOOTH1_0TO100: 'ti_predefined_transitionrampuplongsmooth1_0to100',
    TRANSITIONRAMPUPLONGSMOOTH2_0TO100: 'ti_predefined_transitionrampuplongsmooth2_0to100',
    TRANSITIONRAMPUPMEDIUMSMOOTH1_0TO100: 'ti_predefined_transitionrampupmediumsmooth1_0to100',
    TRANSITIONRAMPUPMEDIUMSMOOTH2_0TO100: 'ti_predefined_transitionrampupmediumsmooth2_0to100',
    TRANSITIONRAMPUPSHORTSMOOTH1_0TO100: 'ti_predefined_transitionrampupshortsmooth1_0to100',
    TRANSITIONRAMPUPSHORTSMOOTH2_0TO100: 'ti_predefined_transitionrampupshortsmooth2_0to100',
    TRANSITIONRAMPUPLONGSHARP1_0TO100: 'ti_predefined_transitionrampuplongsharp1_0to100',
    TRANSITIONRAMPUPLONGSHARP2_0TO100: 'ti_predefined_transitionrampuplongsharp2_0to100',
    TRANSITIONRAMPUPMEDIUMSHARP1_0TO100: 'ti_predefined_transitionrampupmediumsharp1_0to100',
    TRANSITIONRAMPUPMEDIUMSHARP2_0TO100: 'ti_predefined_transitionrampupmediumsharp2_0to100',
    TRANSITIONRAMPUPSHORTSHARP1_0TO100: 'ti_predefined_transitionrampupshortsharp1_0to100',
    TRANSITIONRAMPUPSHORTSHARP2_0TO100: 'ti_predefined_transitionrampupshortsharp2_0to100',
    TRANSITIONRAMPDOWNLONGSMOOTH1_50TO0: 'ti_predefined_transitionrampdownlongsmooth1_50to0',
    TRANSITIONRAMPDOWNLONGSMOOTH2_50TO0: 'ti_predefined_transitionrampdownlongsmooth2_50to0',
    TRANSITIONRAMPDOWNMEDIUMSMOOTH1_50TO0: 'ti_predefined_transitionrampdownmediumsmooth1_50to0',
    TRANSITIONRAMPDOWNMEDIUMSMOOTH2_50TO0: 'ti_predefined_transitionrampdownmediumsmooth2_50to0',
    TRANSITIONRAMPDOWNSHORTSMOOTH1_50TO0: 'ti_predefined_transitionrampdownshortsmooth1_50to0',
    TRANSITIONRAMPDOWNSHORTSMOOTH2_50TO0: 'ti_predefined_transitionrampdownshortsmooth2_50to0',
    TRANSITIONRAMPDOWNLONGSHARP1_50TO0: 'ti_predefined_transitionrampdownlongsharp1_50to0',
    TRANSITIONRAMPDOWNLONGSHARP2_50TO0: 'ti_predefined_transitionrampdownlongsharp2_50to0',
    TRANSITIONRAMPDOWNMEDIUMSHARP1_50TO0: 'ti_predefined_transitionrampdownmediumsharp1_50to0',
    TRANSITIONRAMPDOWNMEDIUMSHARP2_50TO0: 'ti_predefined_transitionrampdownmediumsharp2_50to0',
    TRANSITIONRAMPDOWNSHORTSHARP1_50TO0: 'ti_predefined_transitionrampdownshortsharp1_50to0',
    TRANSITIONRAMPDOWNSHORTSHARP2_50TO0: 'ti_predefined_transitionrampdownshortsharp2_50to0',
    TRANSITIONRAMPUPLONGSMOOTH1_0TO50: 'ti_predefined_transitionrampuplongsmooth1_0to50',
    TRANSITIONRAMPUPLONGSMOOTH2_0TO50: 'ti_predefined_transitionrampuplongsmooth2_0to50',
    TRANSITIONRAMPUPMEDIUMSMOOTH1_0TO50: 'ti_predefined_transitionrampupmediumsmooth1_0to50',
    TRANSITIONRAMPUPMEDIUMSMOOTH2_0TO50: 'ti_predefined_transitionrampupmediumsmooth2_0to50',
    TRANSITIONRAMPUPSHORTSMOOTH1_0TO50: 'ti_predefined_transitionrampupshortsmooth1_0to50',
    TRANSITIONRAMPUPSHORTSMOOTH2_0TO50: 'ti_predefined_transitionrampupshortsmooth2_0to50',
    TRANSITIONRAMPUPLONGSHARP1_0TO50: 'ti_predefined_transitionrampuplongsharp1_0to50',
    TRANSITIONRAMPUPLONGSHARP2_0TO50: 'ti_predefined_transitionrampuplongsharp2_0to50',
    TRANSITIONRAMPUPMEDIUMSHARP1_0TO50: 'ti_predefined_transitionrampupmediumsharp1_0to50',
    TRANSITIONRAMPUPMEDIUMSHARP2_0TO50: 'ti_predefined_transitionrampupmediumsharp2_0to50',
    TRANSITIONRAMPUPSHORTSHARP1_0TO50: 'ti_predefined_transitionrampupshortsharp1_0to50',
    TRANSITIONRAMPUPSHORTSHARP2_0TO50: 'ti_predefined_transitionrampupshortsharp2_0to50',
    LONGBUZZFORPROGRAMMATICSTOPPING_100: 'ti_predefined_longbuzzforprogrammaticstopping_100',
    SMOOTHHUM1NOKICKORBRAKEPULSE_50: 'ti_predefined_smoothhum1nokickorbrakepulse_50',
    SMOOTHHUM2NOKICKORBRAKEPULSE_40: 'ti_predefined_smoothhum2nokickorbrakepulse_40',
    SMOOTHHUM3NOKICKORBRAKEPULSE_30: 'ti_predefined_smoothhum3nokickorbrakepulse_30',
    SMOOTHHUM4NOKICKORBRAKEPULSE_20: 'ti_predefined_smoothhum4nokickorbrakepulse_20',
    SMOOTHHUM5NOKICKORBRAKEPULSE_10: 'ti_predefined_smoothhum5nokickorbrakepulse_10',
}
