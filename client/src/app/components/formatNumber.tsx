import React, { useState } from 'react'

export default function FormatNumber({
    num,
}: { num: Number }) {
    const [stringifiedNum] = useState(num.toString());

    let unit = "";
    let formattedNum;
    let splitNum = num.toLocaleString().split(",");

    if (stringifiedNum.length >= 10 && stringifiedNum.length <= 12) {
        unit = "B";

        formattedNum = `${splitNum[0]}${splitNum[1][0] !== "0" ? `.${splitNum[1][0]}` : ""}`;

    } else if (stringifiedNum.length >= 7 && stringifiedNum.length <= 9) {
        unit = "M";

        formattedNum = `${splitNum[0]}${splitNum[1][0] !== "0" ? `.${splitNum[1][0]}` : ""}`;

    } else if (stringifiedNum.length >= 4 && stringifiedNum.length <= 6) {
        unit = "K";

        formattedNum = `${splitNum[0]}${splitNum[1]?.[0] !== "0" ? `.${splitNum[1]?.[0]}` : ""}`;

    } else {
        formattedNum = splitNum ? splitNum[0]: "";
    }

    return (
        <span className='tracking-wide'>{formattedNum}{unit}</span>
    )
}
