// Fetch user location based on IP address
async function getUserLocation(ipAddress) {
    const response = await fetch(`https://ipinfo.io/${ipAddress}?token=0266761af4e91f`);
    return response.json();
}
