import * as fs from 'fs'

export const parsePositions = (data: string): number[] => data.split(',').map(x => parseInt(x, 10))

export const findMinimalFuelConsumption = (positions: number[]) => {
  // Naive solution: Calculate all possible fuel consumptions, under the (perhaps false) assumption that at least one crab stays stationary
  const fuelConsumptions = new Array<number>()
  positions.forEach(targetPosition => {
    const consumptionForTargetPosition = positions.reduce((totalConsumption, crabPosition) => {
      if (targetPosition > crabPosition) {
        return totalConsumption + (targetPosition - crabPosition)
      } else {
        return totalConsumption + (crabPosition - targetPosition)
      }
    }, 0)
    fuelConsumptions.push(consumptionForTargetPosition)
  })

  // Find minimum value
  const minimum = fuelConsumptions.reduce((min, current) => Math.min(min, current), Number.MAX_SAFE_INTEGER)

  return minimum
}

export const findMinimalNonLinearFuelConsumption = (positions: number[]) => {
  // Naive solution: Calculate all possible fuel consumptions, under the (perhaps false) assumption that at least one crab stays stationary
  const fuelConsumptions = new Array<number>()
  positions.forEach(targetPosition => {
    const consumptionForTargetPosition = positions.reduce((totalConsumption, crabPosition) => {
      let distanceToTarget
      if (targetPosition > crabPosition) {
        distanceToTarget = targetPosition - crabPosition
      } else {
        distanceToTarget = crabPosition - targetPosition
      }

      const consumption = (distanceToTarget * (distanceToTarget - 1)) / 2 + distanceToTarget
      return totalConsumption + consumption
    }, 0)
    fuelConsumptions.push(consumptionForTargetPosition)
  })

  // Find minimum value
  const minimum = fuelConsumptions.reduce((min, current) => Math.min(min, current), Number.MAX_SAFE_INTEGER)

  return minimum
}

const data = fs.readFileSync('./src/07/data/positions.txt').toString()
console.log('Minimal fuel consumption:', findMinimalFuelConsumption(parsePositions(data)))
console.log('Minimal fuel consumption - non-linear model:', findMinimalNonLinearFuelConsumption(parsePositions(data)))
