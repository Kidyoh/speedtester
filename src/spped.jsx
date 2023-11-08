import SpeedTest from '@cloudflare/speedtest';
import React, { useState, useEffect } from 'react'

function Speed() {
    const [result, setResult] = useState(null);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        const speedTest = new SpeedTest({ autoStart: false });
        speedTest.onRunningChange = isRunning => {
            setRunning(isRunning);
        };
        speedTest.onResultsChange = () => {
            if (!speedTest.isFinished) {
                const rawResults = speedTest.results.raw;
                setResult({
                    ...rawResults,
                    download: rawResults.download / 1000000,
                    upload: rawResults.upload / 1000000,
                });
            }
        };
        speedTest.onFinish = results => {
            const summary = results.getSummary();
            setResult({
                ...summary,
                download: summary.download / 1000000,
                upload: summary.upload / 1000000,
            });
        };
        speedTest.play();
    }, []);

    return (
        <div>
            <h1>Speed Test</h1>
            <p>{running ? 'Running...' : 'Finished!'}</p>
            {result && (
                <pre>{JSON.stringify(result, null, 2)}</pre>
            )}
        </div>
    )
}

export default Speed