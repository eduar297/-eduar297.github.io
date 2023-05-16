const form = document.getElementById('form')
const brand = document.getElementById('brand')
const model = document.getElementById('model')
const color = document.getElementById('color')
const licensePlate = document.getElementById('license-plate')
const place = document.getElementById('place')
const parking = document.getElementById('parking')

const formExit = document.getElementById('form-exit')
const licensePlateExit = document.getElementById('license-plate-exit')
const placeExit = document.getElementById('place-exit')

const select = document.getElementById('place')

const fragment = document.createDocumentFragment()

for (let floor = 1; floor <= 5; floor++) {
  for (let place = 1; place <= 10; place++) {
    const option = document.createElement('option')
    option.value = `P${floor}L${place}`
    option.textContent = `Floor ${floor} - Place ${place}`
    fragment.appendChild(option)
  }
}

select.appendChild(fragment)

showParking()

function saveVehicle (vehicle) {
  const vehicleJSON = JSON.stringify(vehicle)
  window.localStorage.setItem(vehicle.licensePlate, vehicleJSON)
}

function retrieveVehicle (licensePlate) {
  const vehicleJSON = window.localStorage.getItem(licensePlate)
  const vehicle = JSON.parse(vehicleJSON)
  return vehicle
}

function retrieveVehicleByPlace (place) {
  const keys = Object.keys(window.localStorage)

  for (const key of keys) {
    const vehicle = retrieveVehicle(key)
    if (vehicle.place === place) {
      return vehicle
    }
  }
  return null
}

function showParking () {
  parking.innerHTML = ''
  for (let floor = 1; floor <= 5; floor++) {
    const divFloor = document.createElement('div')
    divFloor.classList.add('floor')
    for (let number = 1; number <= 10; number++) {
      const divPlace = document.createElement('div')
      divPlace.classList.add('place')
      const idPlace = 'P' + floor + 'L' + number
      divPlace.id = idPlace
      const vehicle = retrieveVehicleByPlace(idPlace)
      if (vehicle) {
        divPlace.style.backgroundColor = vehicle.color
        const spanLicensePlate = document.createElement('span')
        spanLicensePlate.textContent = vehicle.licensePlate
        divPlace.appendChild(spanLicensePlate)
      }
      divFloor.appendChild(divPlace)
    }
    parking.appendChild(divFloor)
  }
}

function assignPlace (vehicle) {
  const idPlace = vehicle.place
  const divPlace = document.getElementById(idPlace)
  if (divPlace) {
    divPlace.style.backgroundColor = vehicle.color
    const spanLicensePlate = document.createElement('span')
    spanLicensePlate.textContent = vehicle.licensePlate
    divPlace.appendChild(spanLicensePlate)
    saveVehicle(vehicle)
    console.log(
      'The place ' +
 idPlace +
 ' has been correctly assigned to the vehicle with license plate ' +
 vehicle.licensePlate
    )
  } else {
    console.error(
      'No place was found with the identifier ' + idPlace
    )
  }
}

function freePlace (licensePlate) {
  const vehicle = retrieveVehicle(licensePlate)
  console.log({ vehicle })
  if (vehicle) {
    const idPlace = vehicle.place
    const divPlace = document.getElementById(idPlace)
    if (divPlace) {
      divPlace.style.backgroundColor = '#fff'
      divPlace.innerHTML = ''
      window.localStorage.removeItem(licensePlate)
      console.log(
        'The place ' +
 idPlace +
 ' occupied by the vehicle with license plate ' +
 licensePlate +
 ' has been correctly freed'
      )
    } else {
      console.error('No place was found with that identifier')
    }
  } else {
    console.error('No vehicle was found with that license plate')
  }
}

form.addEventListener('submit', function (event) {
  event.preventDefault()

  const brandValue = brand.value
  const modelValue = model.value

  const colorValue = color.value
  const licensePlateValue = licensePlate.value
  const placeValue = place.value

  if (brandValue && modelValue && colorValue && licensePlateValue && placeValue) {
    const vehicle = {
      brand: brandValue,
      model: modelValue,
      color: colorValue,
      licensePlate: licensePlateValue,
      place: placeValue
    }

    assignPlace(vehicle)

    showParking()
  }
})

formExit.addEventListener('submit', function (event) {
  event.preventDefault()

  const licensePlateExitValue = licensePlateExit.value
  const vehicle = retrieveVehicle(licensePlateExitValue)

  freePlace(licensePlateExitValue)
  placeExit.value = vehicle.place
  showParking()
})
