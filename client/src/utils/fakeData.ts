const submissions: { date: string, value: number }[] = [];

for (let i = 1; i <= 12; i++) {
    for (let j = 1; j <= 29; j++) {
        const value = j * Math.floor(Math.random() * 10);

        if(value > 0){
        submissions.push({ 
            date: `2024-${i < 10 ? `0${i}` : i}-${j < 10 ? `0${j}` : j}`,
            value: j * Math.floor(Math.random() * 10)
        });
    }
    }
}

export default submissions;