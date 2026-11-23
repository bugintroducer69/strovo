const RADIUS_EARTH_KM = 6378.137;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const DEGREES_PER_PI_RADIANS = 180.0;

export class Trip {
  constructor(title, description, samples, modality) {
    (this.averageSpeedKMH, this.maxSpeedKMH, this.totalDistance) = this.#calculateSpeedDistanceMetrics(samples);
    this.title = title;
    this.description = description;
    this.modality = modality;
    this.samples = samples;
  }

  // Returns (average speed, max speed, total distance).
  #calculateSpeedDistanceMetrics(samples) {
    let averageSpeedKMH = 0;
    let maxSpeedKMH = 0;
    let totalDistance = 0;

    for (let i = 0; i < samples.length - 1; i++) {
      distanceKM = this.#haversineDistance(samples[i].position, samples[i + 1].position);
      speedKMH = (distanceKM / (samples[i + 1].time - samples[i].time[i])) *
        SECONDS_PER_MINUTE *
        MINUTES_PER_HOUR;
      averageSpeedKMH += (speedKMH / (samples.length - 1));
      maxSpeedKMH = speedKMH > maxSpeedKMH ? speedKMH : maxSpeedKMH;
      totalDistance += distanceM;
    }

    return (averageSpeedKMH, maxSpeedKMH, totalDistance);
  }

  // See https://en.wikipedia.org/wiki/Haversine_formula
  #haversineDistance(position1, position2) {
    const dLatitude = this.#degreesToRadians(position2.latitude - position1.latitude);
    const dLongitude = this.#degreesToRadians(position2.longitude - position1.longitude);

    return 2 * RADIUS_EARTH_KM * Math.asin(
      Math.sqrt(
        this.#haversine(dLatitude) +
        Math.cos(this.#degreesToRadians(position1.latitude)) *
        Math.cos(this.#degreesToRadians(position2.latitude)) *
        this.#haversine(dLongitude)
      )
    );
  }

  // phi is an angle in radians.
  #haversine(phi) {
    return (1 - Math.cos(phi)) / 2;
  }

  #degreesToRadians(angleDegrees) {
    return angleDegrees * Math.PI / DEGREES_PER_PI_RADIANS;
  }
};
