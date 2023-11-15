import SpeedTest from '@cloudflare/speedtest';
import React, { useState, useEffect } from 'react';
import Speedometer, {
    Background,
    Arc,
    Needle,
    Progress,
    Marks,
    Indicator,
} from 'react-speedometer';


function Speed() {
    const [result, setResult] = useState(null);
    const [running, setRunning] = useState(false);
    const [ipAddress, setIpAddress] = useState(null);
    const [currentDownloadSpeed, setCurrentDownloadSpeed] = useState(0);
    const [currentUploadSpeed, setCurrentUploadSpeed] = useState(0);
    const [isp, setISP] = useState(null);
    const [country, setCountry] = useState(null);
    const [city, setCity] = useState(null);
    const [region, setRegion] = useState(null);
    const [zip, setZip] = useState(null);
    const [timezone, setTimezone] = useState(null);
    const [org, setOrg] = useState(null);
    const [as, setAs] = useState(null);

    const startSpeedTest = () => {
        setResult(null);
        setCurrentDownloadSpeed(null); 
        setCurrentUploadSpeed(null);
        const speedTest = new SpeedTest({
            autoStart: true,
            measurements: [
                { type: 'latency', numPackets: 1 },
                { type: 'download', bytes: 1e6, count: 5 },
                { type: 'upload', bytes: 1e5, count: 5 },
                { type: 'packetLoss', numPackets: 1e3},
            ],
        });
        speedTest.onRunningChange = isRunning => {
            setRunning(isRunning);
        };
        fetch('https://api.ipify.org/')
    .then(response => response.text())
    .then(ip => {
        setIpAddress(ip);
        return fetch(`https://ip-api.com/json/${ip}`);
    })
    .then(response => response.json())
    .then(data => {
        setISP(data.isp);
        setCountry(data.country);
        setCity(data.city);
        setRegion(data.regionName);
        setZip(data.zip);
        setTimezone(data.timezone);
        setOrg(data.org);
        setAs(data.as);
    
    })
    .catch(error => console.error('Error fetching IP address:', error));
        speedTest.onResultsChange = () => {
            if (!speedTest.isFinished) {
                const rawResults = speedTest.results.raw;
                const downloadResults = rawResults.download.results;
                Object.keys(downloadResults).forEach(key => {
                    const downloadData = downloadResults[key].sideLatency;
                    downloadData.forEach((item, index) => {
                        const downloadSpeed = (item.transferSize * 8 * 1024) / (item.payloadDownloadTime / 10) / 1e6;
                        setCurrentDownloadSpeed(downloadSpeed);
                    });
                });
                const uploadData = rawResults.upload.results;
                Object.keys(uploadData).forEach(key => {
                    const uploadItem = uploadData[key].sideLatency;
                    uploadItem.forEach((item, index) => {
                        const uploadSpeed = (item.transferSize * 8) / (item.payloadDownloadTime / 10) / 1e6;
                        setCurrentUploadSpeed(uploadSpeed);
                    });
                });
                console.log(rawResults)
            }
        };
        speedTest.onFinish = results => {
            const summary = results.getSummary();
            console.log(summary)
            const scores = results.getScores();
            setResult({
                ...summary,
                download: summary.download / 1000000,
                upload: summary.upload / 1000000,
                scores,
                latency : summary.latency,
                
            });
            console.log(scores)
        };

    };


    return (
        <div className="container mt-5 p-5 bg-slate-400 rounded-xl">
            <h1 className="text-2xl mb-4">Speed Test Results</h1>
            <button
                onClick={startSpeedTest}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={running}
            >
                Start Test
            </button>
            {running ? (
                <div className="flex flex-wrap justify-center md:flex-row flex-col">
                    <div className="loading"></div>
                    <p className="ml-2">Testing...</p>
                </div>
            ) : (
                <div className='flex flex-wrap justify-center'>
                    <div className='m-3 pb-40'>
                        <div style={{ height: '100px' }}>
                            <Speedometer
                                value={result ? result.download : currentDownloadSpeed}
                                fontFamily='squada-one'
                            >
                                <Background />
                                <Arc arcWidth={0.2} />
                                <Needle />
                                <Progress />
                                <Marks />
                                <Indicator />
                            </Speedometer>
                            {result && (
                                <div className='mt-2 text-center'>
                                    <p>Download: {result.download.toFixed(2)} Mbps</p>
                                </div>
                            )}
                        </div>
                    </div>
                
                    <div className='m-3 pb-36'>
                        <div style={{ height: '100px' }}>
                            <Speedometer
                                value={result ? result.upload : currentUploadSpeed}
                                fontFamily='squada-one'
                            >
                                <Background />
                                <Arc arcWidth={0.2} />
                                <Needle />
                                <Progress />
                                <Marks />
                                <Indicator />
                            </Speedometer>
                            {result && (
                                <div className='mt-2 text-center'>
                                    <p>Upload: {result.upload.toFixed(2)} Mbps</p>
                                </div>
                            )}
                        </div>
                    </div>
                 
                </div>
            )}
  <div className='border rounded-md p-4 bg-white shadow-lg mt-9'>
  {ipAddress && (
    <p className="mt-2">Your IP Address: {ipAddress}</p>
)}
{isp && (
    <p className="mt-2">Your ISP: {isp}</p>
)}
{country && (
    <p className="mt-2">Your Country: {country}</p>
)}
{city && (
    <p className="mt-2">Your City: {city}</p>
)}
{region && (
    <p className="mt-2">Your Region: {region}</p>
)}
{zip && (
    <p className="mt-2">Your Postal Code: {zip}</p>
)}
{timezone && (
    <p className="mt-2">Your Timezone: {timezone}</p>
)}
{org && (
    <p className="mt-2">Your Organization: {org}</p>
)}
{as && (
    <p className="mt-2">Your AS: {as}</p>
)}
  {result && result.scores && result.latency &&(
    <div className='mt-4'>
      <h2 className="text-xl font-bold mb-2">AIM Scores:</h2>
      <div className="mb-2">
        <p>Streaming Points: {result.scores.streaming.points}, Classification: {result.scores.streaming.classificationName}</p>
      </div>
      <div className="mb-2">
        <p>Gaming Points: {result.scores.gaming.points}, Classification: {result.scores.gaming.classificationName}</p>
      </div>
      <div>
        <p>RTC Points: {result.scores.rtc.points}, Classification: {result.scores.rtc.classificationName}</p>
      </div>
    </div>
  )}
</div>


        </div>
    );
}

export default Speed;
