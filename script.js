const busStopIdInput = document.getElementById('busStopId');
const arrivalInfo = document.getElementById('arrivalInfo');

let intervalId = null; //Global variable to store the interval ID

async function fetchBusArrival(busStopId) {
  const response = await fetch(
    `https://sg-bus-arrivals.vercel.app/?id=${busStopId}`
  );

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error('Error fetching bus arrival data');
  }
}

function formatArrivalData(data) {
  const buses = data.services;
  const formattedData = [];

  for (const bus of buses) {
    const arrivalTimeString = `${bus.next_bus_mins} min(s)`;
    if (bus.next_bus_mins < 0) {
      formattedData.push(`
     <div>
      <strong>Bus ${bus.bus_no}</strong>: Arriving
    </div> 
  `);
    } else {
      formattedData.push(`
     <div>
      <strong>Bus ${bus.bus_no}</strong>: ${arrivalTimeString}
    </div> 
  `);
    }
  }
  const busCount = `${buses.length} buses`;
  return formattedData.join('') + `<div>${busCount}</div>`; //joins them all back with a space in between
}

function displayBusArrival(data) {
  arrivalInfo.innerHTML = 'Loading...';

  //Clear any previous interval before starting a new one
  if (intervalId) {
    clearInterval(intervalId);
  }

  //fetch immediately once
  fetchBusArrival(data)
    .then((arrivalData) => {
      const formattedArrivalData = formatArrivalData(arrivalData);
      arrivalInfo.innerHTML = formattedArrivalData;
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  intervalId = setInterval(() => {
    fetchBusArrival(data)
      .then((arrivalData) => {
        const formattedArrivalData = formatArrivalData(arrivalData);
        arrivalInfo.innerHTML = formattedArrivalData;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, 5000);
}

function getBusTiming() {
  const busStopId = busStopIdInput.value;
  displayBusArrival(busStopId);
}
