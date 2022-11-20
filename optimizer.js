const durometer = 70;
const assumedDeflection = 10;  // %
const classicSorbothane = false;
const excitationFrequency = 100;  // Hz

function calcuateVibration(length, thickness, load, excitationFrequency){
    //Initiate variables and check for invalid entries
    var errors = false;

    var shapeFactor = ((Math.pow(length,2))/(2 * thickness*(2 * length)));
    var loadedArea = Math.pow(length,2);

    if (shapeFactor > 1.20){throwVibrationError('shapeFactor');}

    if (!errors) {
        //Display loaded area and shape factor results
        // console.log('LoadedArea', String(loadedArea.toFixed(2)));
        // console.log('ShapeFactor', String(shapeFactor.toFixed(2)));

        if (percentDeflection(shapeFactor, load, thickness, loadedArea)) {
            var naturalFrequency = naturalFrequencyCalc(loadedArea, shapeFactor, thickness, load);

            //Continue on transmissibility as long as natural frequency did not exceed limit
            if (naturalFrequency !== 0) {
                const isolation = calcIsolation(durometer, excitationFrequency, naturalFrequency);
                // console.log("Isolation", isolation)
                return isolation;
            }
        }
    }
    return -999;
}

function percentDeflection(shapeFactor, load, thickness, loadedArea){


    //Set compressive stress
    var compressiveStress = compressiveStresses(durometer, assumedDeflection);

    //Calculate Compressive Modulus
    var compressiveModulus = compressiveStress / (parseFloat(assumedDeflection)/100);

    //Calculate Corrected Compressive Modulus
    var correctedCompressiveModulus = compressiveModulus * (1 + 2 * Math.pow(shapeFactor,2));

    //Calculate static deflection and percent deflection
    var staticDeflection = (load * thickness)/(correctedCompressiveModulus * loadedArea);
    var percentDeflection = 100 * staticDeflection/thickness;

    //Display all results
    // console.log('CompressiveStress', String(compressiveStress.toFixed(2)));
    // console.log('CompressiveModulus', String(compressiveModulus.toFixed(2)));
    // console.log('CorrectedCompressiveModulus', String(correctedCompressiveModulus.toFixed(2)));
    // console.log('StaticDeflection', String(staticDeflection.toFixed(2)));
    // console.log('PercentDeflection', String(percentDeflection.toFixed(2)) + '%');

    //Check if percent deflection is within +/-3% of the assumed. Use throwError to console.log if not
    if (percentDeflection > parseFloat(assumedDeflection) + 3 || percentDeflection < parseFloat(assumedDeflection) - 3) {
        throwVibrationError('deflectionOutOfRange');
        return false
    }
    return true
}

function compressiveStresses(durometer, assumedPercentDeflection){

    //Set material to be calculated
    if (classicSorbothane){
        //Set and print the Compressive Stress
        if (durometer === 30 && assumedPercentDeflection === 10){
            return  0.9;
        } else if (durometer === 30 && assumedPercentDeflection === 15){
            return 1.5;
        } else if (durometer === 30 && assumedPercentDeflection === 20){
            return 2.1;
        }  else if (durometer === 40 && assumedPercentDeflection === 10){
            return 2.4;
        }  else if (durometer === 40 && assumedPercentDeflection === 15){
            return  4.3;
        }  else if (durometer === 40 && assumedPercentDeflection === 20){
            return  6.4;
        }  else if (durometer === 50 && assumedPercentDeflection === 10){
            return 2.7;
        }  else if (durometer === 50 && assumedPercentDeflection === 15){
            return 4.4;
        }  else if (durometer === 50 && assumedPercentDeflection === 20){
            return 6.3;
        }  else if (durometer === 60 && assumedPercentDeflection === 10){
            return  5.6;
        }  else if (durometer === 60 && assumedPercentDeflection === 15){
            return  9.3;
        }  else if (durometer === 60 && assumedPercentDeflection === 20){
            return  13.8;
        }  else if (durometer === 70 && assumedPercentDeflection === 10){
            return 11.8;
        }  else if (durometer === 70 && assumedPercentDeflection === 15){
            return 20.3;
        }  else if (durometer === 70 && assumedPercentDeflection === 20){
            return 30.0;
        }  else if (durometer === 80 && assumedPercentDeflection === 10){
            return  19.1;
        }  else if (durometer === 80 && assumedPercentDeflection === 15){
            return  31.4;
        }  else if (durometer === 80 && assumedPercentDeflection === 20){
            return  45.0;
        }
    } else {
        //Set and print the Compressive Stress
        if (durometer === 30 && assumedPercentDeflection === 10){
            return  2.1;
        } else if (durometer === 30 && assumedPercentDeflection === 15){
            return   3.5;
        } else if (durometer === 30 && assumedPercentDeflection === 20){
            return   5.1;
        } else if (durometer === 50 && assumedPercentDeflection === 10){
            return  4.7;
        } else if (durometer === 50 && assumedPercentDeflection === 15){
            return   7.5;
        } else if (durometer === 50 && assumedPercentDeflection === 20){
            return   10.7;
        } else if (durometer === 70 && assumedPercentDeflection === 10){
            return  10.3;
        } else if (durometer === 70 && assumedPercentDeflection === 15){
            return   16.5;
        } else if (durometer === 70 && assumedPercentDeflection === 20){
            return   23.7;
        }
    }
}

function calcIsolation(durometer, excitationFrequency, naturalFrequency){
    //Run calcuations
    var tanDelta = tanDeltaCalc(durometer, excitationFrequency);
    var frequencyRatio = excitationFrequency/naturalFrequency;
    var dynamicShearRatio = dynamicCompressiveModulusCalc(assumedDeflection, durometer, naturalFrequency) / dynamicCompressiveModulusCalc(assumedDeflection, durometer, excitationFrequency);
    var transmissibility = Math.sqrt((1+Math.pow(tanDelta,2))/(Math.pow((1-(Math.pow(frequencyRatio,2))*dynamicShearRatio),2)+Math.pow(tanDelta,2)));
    return (1 - transmissibility)*100;
}

function dynamicCompressiveModulusCalc(assumedPercentDeflection, durometer, frequency){
    var dynamicCompressiveModulus;

    if (classicSorbothane) {
        if (durometer === 80 && assumedPercentDeflection === 20){
            if (frequency <=125){
                dynamicCompressiveModulus = (1.25784 * Math.pow(10.0, -7.0) * Math.pow(frequency, 5.0)) + (-4.51095 * Math.pow(10.0, -5.0) * Math.pow(frequency, 4.0)) + (5.99356 * Math.pow(10.0, -3.0) * Math.pow(frequency, 3.0)) + (-0.376048 * Math.pow(frequency, 2.0)) + (12.8815 * frequency) + 345.324;
            } else {
                dynamicCompressiveModulus = (2.06965 * Math.pow(10.0, -5.0) * Math.pow(frequency, 3.0)) + (-1.63132 * Math.pow(10, -2.0) * Math.pow(frequency, 2.0)) + (4.65288 * frequency) + 284.8557;
        }} else if (durometer === 80 && assumedPercentDeflection === 15){
            if (frequency <=125){
                dynamicCompressiveModulus = (1.127254 * Math.pow(10.0, -7.0) * Math.pow(frequency, 5.0)) + (-3.9671013 * Math.pow(10.0, -5.0) * Math.pow(frequency, 4.0)) + (5.181148 * Math.pow(10.0, -3.0) * Math.pow(frequency, 3.0)) + (-0.319312 * Math.pow(frequency, 2.0)) + (70.82555 * frequency) + 303.9177;
            } else {
                dynamicCompressiveModulus = (1.429763 * Math.pow(10.0, -5.0) * Math.pow(frequency, 3.0)) + (-1.101394 * Math.pow(10, -2.0) * Math.pow(frequency, 2.0)) + (3.206404 * frequency) + 284.8557;
        }} else if (durometer === 80 && assumedPercentDeflection === 10){
            dynamicCompressiveModulus = (-1.05218* Math.pow(10.0, -11.0) * Math.pow(frequency, 6.0)) + (1.11594 * Math.pow(10.0, -8.0) * Math.pow(frequency, 5.0)) + (-4.65058 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (9.63652 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-0.104597 * Math.pow(frequency, 2.0)) + (6.34969 * frequency) + 274.358;
        } else if (durometer === 70 && assumedPercentDeflection === 20){
            dynamicCompressiveModulus = (-1.73328 * Math.pow(10.0, -11.0) * Math.pow(frequency, 6.0)) + (1.76586 * Math.pow(10.0, -8.0) * Math.pow(frequency, 5.0)) + (-7.03325 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (1.38773 * Math.pow(10.0, -3.0) * Math.pow(frequency, 3.0)) + (-0.144098 * Math.pow(frequency, 2.0)) + (8.42701 * frequency) + 191.228;
        } else if (durometer === 70 && assumedPercentDeflection === 15){
            dynamicCompressiveModulus =  (-1.53305* Math.pow(10.0, -11.0) * Math.pow(frequency, 6.0)) + (1.5413 * Math.pow(10.0, -8.0) * Math.pow(frequency, 5.0)) + (-6.07042 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (1.18808 * Math.pow(10.0, -3.0) * Math.pow(frequency, 3.0)) + (-0.122916 * Math.pow(frequency, 2.0)) + (7.27108 * frequency) + 167.371;
        } else if (durometer === 70 && assumedPercentDeflection === 10){
            dynamicCompressiveModulus =  (-1.33011 * Math.pow(10.0, -11.0) * Math.pow(frequency, 6.0)) + (1.34219 * Math.pow(10.0, -8.0) * Math.pow(frequency, 5.0)) + (-5.30256 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (1.04157 * Math.pow(10.0, -3.0) * Math.pow(frequency, 3.0)) + (-0.10821 * Math.pow(frequency, 2.0)) + (6.47294 * frequency) + 148.502;
        } else if (durometer === 60 && assumedPercentDeflection === 20){
            dynamicCompressiveModulus =  (-1.07373* Math.pow(10.0, -11.0) * Math.pow(frequency, 6.0)) + (1.15216 * Math.pow(10.0, -8.0) * Math.pow(frequency, 5.0)) + (-4.89238 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (1.03895 * Math.pow(10.0, -3.0) * Math.pow(frequency, 3.0)) + (-0.115653 * Math.pow(frequency, 2.0)) + (7.11385 * frequency) + 125.021;
        } else if (durometer === 60 && assumedPercentDeflection === 15){
            dynamicCompressiveModulus =  (-1.1797 * Math.pow(10.0, -11.0) * Math.pow(frequency, 6.0)) + (1.2062 * Math.pow(10.0, -8.0) * Math.pow(frequency, 5.0)) + (-4.8460 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (9.6797 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-0.010138 * Math.pow(frequency, 2.0)) + (6.0441 * frequency) + 107.649;
        } else if (durometer === 60 && assumedPercentDeflection === 10){
            dynamicCompressiveModulus =  (-8.8411* Math.pow(10.0, -12.0) * Math.pow(frequency, 6.0)) + (9.2794 * Math.pow(10.0, -9.0) * Math.pow(frequency, 5.0)) + (-3.8128 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (7.7670 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-8.3016 * Math.pow(10.0, -2.0) * Math.pow(frequency, 2.0)) + (5.1034 * frequency) + 94.620;
        } else if (durometer === 50 && assumedPercentDeflection === 20){
            dynamicCompressiveModulus =  (-1.2657 * Math.pow(10.0, -11.0) * Math.pow(frequency, 6.0)) + (1.3016 * Math.pow(10.0, -8.0) * Math.pow(frequency, 5.0)) + (-5.2521 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (1.0583 * Math.pow(10.0, -3.0) * Math.pow(frequency, 3.0)) + (-1.1379 * Math.pow(10.0, -1.0) * Math.pow(frequency, 2.0)) + (6.983 * frequency) + 66.549;
        } else if (durometer === 50 && assumedPercentDeflection === 15){
            dynamicCompressiveModulus =  (-1.4456 * Math.pow(10.0, -11.0) * Math.pow(frequency, 6.0)) + (1.418 * Math.pow(10.0, -8.0) * Math.pow(frequency, 5.0)) + (-5.4048 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (1.0162 * Math.pow(10.0, -3.0) * Math.pow(frequency, 3.0)) + (-1.0136 * Math.pow(10.0, -2) * Math.pow(frequency, 2.0)) + (6.0589 * frequency) + 54.479;
        } else if (durometer === 50 && assumedPercentDeflection === 10){
            dynamicCompressiveModulus =  (-9.7979* Math.pow(10.0, -12.0) * Math.pow(frequency, 6.0)) + (9.9409 * Math.pow(10.0, -9.0) * Math.pow(frequency, 5.0)) + (-3.9459 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (7.7874 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-8.1846 * Math.pow(10.0, -2)*Math.pow(frequency, 2.0)) + (5.1874 * frequency) + 47.493;
        } else if (durometer === 40 && assumedPercentDeflection === 20){
            dynamicCompressiveModulus =  (-9.3543* Math.pow(10.0, -12.0) * Math.pow(frequency, 6.0)) + (9.6298 * Math.pow(10.0, -9.0) * Math.pow(frequency, 5.0)) + (-3.8864 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (7.8329 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-8.4633 * Math.pow(10.0, -2.0) * Math.pow(frequency, 2.0)) + (5.4404 * frequency) + 53.674;
        } else if (durometer === 40 && assumedPercentDeflection === 15){
            dynamicCompressiveModulus =  (-9.2590 * Math.pow(10.0, -12.0) * Math.pow(frequency, 6.0)) + (9.3295 * Math.pow(10.0, -9.0) * Math.pow(frequency, 5.0)) + (-3.6772 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (7.2096 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-7.5406 * Math.pow(10.0, -2)*Math.pow(frequency, 2.0)) + (4.7579 * frequency) + 46.049;
        } else if (durometer === 40 && assumedPercentDeflection === 10){
            dynamicCompressiveModulus =  (-7.4187* Math.pow(10.0, -12.0) * Math.pow(frequency, 6.0)) + (7.5303 * Math.pow(10.0, -9.0) * Math.pow(frequency, 5.0)) + (-2.9964 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (5.9486 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-6.3226 * Math.pow(10.0, -2) * Math.pow(frequency, 2.0)) + (4.1006 * frequency) + 39.945;
        } else if (durometer === 30 && assumedPercentDeflection === 20){
            dynamicCompressiveModulus =  (-7.5398* Math.pow(10.0, -12.0) * Math.pow(frequency, 6.0)) + (7.5624 * Math.pow(10.0, -9.0) * Math.pow(frequency, 5.0)) + (-2.9715 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (5.8354 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-6.1813 * Math.pow(10.0, -2.0) * Math.pow(frequency, 2.0)) + (4.023 * frequency) + 28.956;
        } else if (durometer === 30 && assumedPercentDeflection === 15){
            dynamicCompressiveModulus =  (-5.871 * Math.pow(10.0, -12.0) * Math.pow(frequency, 6.0)) + (5.98 * Math.pow(10.0, -9.0) * Math.pow(frequency, 5.0)) + (-2.384 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (4.735 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-5.049 * Math.pow(10,-2) * Math.pow(frequency, 2.0)) + (3.3565 * frequency) + 24.618;
        } else if (durometer === 30 && assumedPercentDeflection === 10){
            dynamicCompressiveModulus =  (-5.193 * Math.pow(10.0, -12.0) * Math.pow(frequency, 6.0)) + (5.293 * Math.pow(10.0, -9.0) * Math.pow(frequency, 5.0)) + (-2.112 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (4.196 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-4.454 * Math.pow(10,-2) * Math.pow(frequency, 2.0)) + (2.943 * frequency) + 21.249;
        }
    } else { // water-resistant
        if (durometer === 70 && assumedPercentDeflection === 20){
            dynamicCompressiveModulus = (-1.051636 * Math.pow(10.0, -11.0) * Math.pow(frequency, 6.0)) + (1.067940 * Math.pow(10.0, -8.0) * Math.pow(frequency, 5.0)) + (-4.259401 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (8.503191 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-9.182794*Math.pow(10.0, -2.0) * Math.pow(frequency, 2.0)) + (6.089878 * frequency) + 152.2411;
        } else if(durometer === 70 && assumedPercentDeflection === 15){
            dynamicCompressiveModulus = (-1.072250 * Math.pow(10.0, -11.0) * Math.pow(frequency, 6.0)) + (1.085746 * Math.pow(10.0, -8.0) * Math.pow(frequency, 5.0)) + (-4.291457 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (8.404121 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-8.737484*Math.pow(10.0, -2)*Math.pow(frequency, 2.0)) + (5.508484 * frequency) + 126.4462;
        } else if(durometer === 70 && assumedPercentDeflection === 10){
            dynamicCompressiveModulus = (-7.859206 * Math.pow(10.0, -12.0) * Math.pow(frequency, 6.0)) + (8.267017 * Math.pow(10.0, -9.0) * Math.pow(frequency, 5.0)) + (-3.405873 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (6.973143 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-7.562713*Math.pow(10.0, -2)*Math.pow(frequency, 2.0)) + (4.928733 * frequency) + 109.95;
        } else if (durometer === 50 && assumedPercentDeflection === 20){
            dynamicCompressiveModulus = (-1.237292 * Math.pow(10.0, -11.0) * Math.pow(frequency, 6.0)) + (1.234641 * Math.pow(10.0, -8.0) * Math.pow(frequency, 5.0)) + (-4.822491 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (9.381858 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-9.756099*Math.pow(10.0, -2.0) * Math.pow(frequency, 2.0)) + (6.04292 * frequency) + 86.49011;
        } else if(durometer === 50 && assumedPercentDeflection === 15){
            dynamicCompressiveModulus = (-1.115666 * Math.pow(10.0, -11.0) * Math.pow(frequency, 6.0)) + (1.127333 * Math.pow(10.0, -8.0) * Math.pow(frequency, 5.0)) + (-4.441369 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (8.659074 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-8.921857*Math.pow(10.0, -2)*Math.pow(frequency, 2.0)) + (5.42264 * frequency) + 74.48925;
        } else if(durometer === 50 && assumedPercentDeflection === 10){
            dynamicCompressiveModulus = (-8.309989 * Math.pow(10.0, -12.0) * Math.pow(frequency, 6.0)) + (8.66666 * Math.pow(10.0, -9.0) * Math.pow(frequency, 5.0)) + (-3.532374 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (7.144857 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-7.640809*Math.pow(10.0, -2.0) * Math.pow(frequency, 2.0)) + (4.801465 * frequency) + 66.06964;
        } else if (durometer === 30 && assumedPercentDeflection === 20){
            dynamicCompressiveModulus = (-5.332239 * Math.pow(10.0, -12.0) * Math.pow(frequency, 6.0)) + (5.623751 * Math.pow(10.0, -9.0) * Math.pow(frequency, 5.0)) + (-2.354128 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (4.944782 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-5.572548*Math.pow(10.0, -2.0) * Math.pow(frequency, 2.0)) + (3.788354 * frequency) + 38.88995;
        } else if(durometer === 30 && assumedPercentDeflection === 15){
            dynamicCompressiveModulus = (-6.360774 * Math.pow(10.0, -12.0) * Math.pow(frequency, 6.0)) + (6.450475 * Math.pow(10.0, -9.0) * Math.pow(frequency, 5.0)) + (-2.563229 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (5.073048 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-5.356205*Math.pow(10.0, -2)*Math.pow(frequency, 2.0)) + (3.435224 * frequency) + 32.95825;
        } else if(durometer === 30 && assumedPercentDeflection === 10){
            dynamicCompressiveModulus = (-5.358683 * Math.pow(10.0, -12.0) * Math.pow(frequency, 6.0)) + (5.42859 * Math.pow(10.0, -9.0) * Math.pow(frequency, 5.0)) + (-2.170121 * Math.pow(10.0, -6.0) * Math.pow(frequency, 4.0)) + (4.359503 * Math.pow(10.0, -4.0) * Math.pow(frequency, 3.0)) + (-4.704137*Math.pow(10.0, -2.0) * Math.pow(frequency, 2.0)) + (3.082309 * frequency) + 29.41282;
        }
    }

    return dynamicCompressiveModulus;
}

function tanDeltaCalc(durometer, frequency){
    if (classicSorbothane)//Tan Delta equations for Standard Sorbothane
			{
				if (durometer === 80) {
					if (frequency <= 75) {
						return 0.0349 * Math.log(frequency) + 0.1147;
					} else {
						return (-5.69128 * Math.pow(10.0, -13.0) * Math.pow(frequency, 5.0)) + (5.94633 * Math.pow(10.0, -10.0) * Math.pow(frequency, 4.0)) + (-2.33558 * Math.pow(10.0, -7.0) * Math.pow(frequency, 3.0)) + (4.17365 * Math.pow(10.0, -5.0) * Math.pow(frequency, 2.0)) + (-3.18995 * Math.pow(10.0, -3.0) * frequency) + 0.3509648;
					}
				} else if (durometer === 70) {
					if (frequency < 30) {
						return 0.0486 * Math.log(frequency) + 0.1982;
					} else {
						return (4.71523 * Math.pow(10.0, -15.0) * Math.pow(frequency, 6.0)) + (-4.36756 * Math.pow(10.0, -12.0) * Math.pow(frequency, 5.0)) + (1.52245 * Math.pow(10.0, -9.0) * Math.pow(frequency, 4.0)) + (-2.40914 * Math.pow(10.0, -7.0) * Math.pow(frequency, 3.0)) + (1.44614 * Math.pow(10.0, -5.0) * Math.pow(frequency, 2.0)) + (3.1846 * Math.pow(10.0, -4.0) * frequency) + 0.343142;
					}
				} else if (durometer === 60) {
					if (frequency <= 15) {
						return 0.0564 * Math.log(frequency) + 0.2425;
					} else {
						return (-8.56988 * Math.pow(10.0, -15.0) * Math.pow(frequency, 6.0)) + (8.69796 * Math.pow(10.0, -12.0) * Math.pow(frequency, 5.0)) + (-3.44548 * Math.pow(10.0, -9.0) * Math.pow(frequency, 4.0)) + (6.80528 * Math.pow(10.0, -7.0) * Math.pow(frequency, 3.0)) + (-7.21339 * Math.pow(10.0, -5.0) * Math.pow(frequency, 2.0)) + (4.13626 * Math.pow(10.0,  -3.0) * frequency) + 0.35155;
					}
				} else if (durometer === 50) {
					if (frequency < 5) {
									return (-1.65159 * Math.pow(10.0, -3.0) * Math.pow(frequency, 2.0)) + (3.84295 * Math.pow(10.0, -2.0) * frequency) + 0.414596;
								} else {
									return (-1.9468 * Math.pow(10.0, -14.0) * Math.pow(frequency, 6.0)) + (1.92987 * Math.pow(10.0, -11.0) * Math.pow(frequency, 5.0)) + (-7.4581 * Math.pow(10.0, -9.0) * Math.pow(frequency, 4.0)) + (1.42152 * Math.pow(10.0, -6.0) * Math.pow(frequency, 3.0)) + (-1.39133 * Math.pow(10.0, -4.0) * Math.pow(frequency, 2.0)) + (6.50914 * Math.pow(10.0, -3.0) * frequency) + .540666;
								}
				} else if (durometer === 40) {
					if (frequency < 15) {
						return 0.07 * Math.log(frequency) + 0.4248;
					} else {
						return (-8.83215 * Math.pow(10.0, -15.0) * Math.pow(frequency, 6.0)) + (9.12593 * Math.pow(10.0, -12.0) * Math.pow(frequency, 5.0)) + (-3.66571 * Math.pow(10.0, -9.0) * Math.pow(frequency, 4.0)) + (7.23227 * Math.pow(10.0, -7.0) * Math.pow(frequency, 3.0)) + (-7.37898 * Math.pow(10.0, -5.0) * Math.pow(frequency, 2.0)) + (3.74709 * Math.pow(10.0, -3.0) *frequency) + 0.568218;
					}
				} else {//Durometer of 30
					if (frequency < 5) {
						return (-1.97104 * Math.pow(10.0, -3.0) * Math.pow(frequency, 2.0)) + (4.59291 * Math.pow(10.0, -2.0) * frequency) + 0.497431;
					} else {
						return (-2.39486 * Math.pow(10.0, -14.0) * Math.pow(frequency, 6.0)) + (2.39167 * Math.pow(10.0, -11.0) * Math.pow(frequency, 5.0)) + (-9.28204 * Math.pow(10.0, -9.0) * Math.pow(frequency, 4.0)) + (1.76398 * Math.pow(10.0, -6.0) * Math.pow(frequency, 3.0)) + (-1.702133 * Math.pow(10.0, -4.0) * Math.pow(frequency, 2.0)) + (7.78871 * Math.pow(10.0, -3.0) * frequency) + 0.648829;
					}
				}
			} else { //Tan Delta equations for Water Resistant Sorbothane. Enter after material testing.
			    if (durometer === 70) {
					 if (frequency < 15) {
						 return 7.021381*Math.pow(10, -2) * Math.log(frequency) + 0.1700486;
                    } else if (frequency >= 15 && frequency <= 175) {
                            return (-9.462741 * Math.pow(10.0, -16.0)*Math.pow(frequency, 6.0)) + (1.446431 * Math.pow(10.0, -11.0)*Math.pow(frequency, 5.0)) + (-7.314493 * Math.pow(10, -9)*Math.pow(frequency, 4.0)) + (1.455682 * Math.pow(10, -6)*Math.pow(frequency, 3.0)) + (-1.443868*Math.pow(10.0, -4.0)*Math.pow(frequency, 2)) + (7.808728*Math.pow(10.0, -3)*frequency) + 0.2720925;
                    } else {
                            return (8.054030 * Math.pow(10.0, -11.0)*Math.pow(frequency, 5.0)) + (-9.703430 * Math.pow(10, -8)*Math.pow(frequency, 4.0)) + (4.646749 * Math.pow(10, -5)*Math.pow(frequency, 3.0)) + (-1.105932*Math.pow(10.0, -2.0)*Math.pow(frequency, 2)) + (1.309110*frequency) - 61.14585;
                    }
                } else if (durometer === 50) {
                     if (frequency < 15) { return 6.106179*Math.pow(10, -2) * Math.log(frequency) + 0.3161674;
                    } else if (frequency >= 15 && frequency <= 175) {
                       return (-7.660952 * Math.pow(10.0, -15.0)*Math.pow(frequency, 6.0)) + (1.568933 * Math.pow(10.0, -11.0)*Math.pow(frequency, 5.0)) + (-6.848986 * Math.pow(10, -9)*Math.pow(frequency, 4.0)) + (1.283346 * Math.pow(10, -6)*Math.pow(frequency, 3.0)) + (-1.207870*Math.pow(10.0, -4.0)*Math.pow(frequency, 2)) + (5.714358*Math.pow(10.0, -3)*frequency) + 0.4153751;
                   } else{
                       return (-3.491414 * Math.pow(10.0, -9.0)*Math.pow(frequency, 4.0)) + (3.424580 * Math.pow(10, -6)*Math.pow(frequency, 3.0)) + (-1.251313*Math.pow(10.0, -3.0)*Math.pow(frequency, 2)) + (0.2021891*frequency) - 11.61519;
                   }
				 }
				else{ //Durometer = 30
				if (frequency < 15){
						 return 0.06579150* Math.log(frequency) + 0.4432958;
                 } else if (frequency >= 15 && frequency <= 175) {
						 return (-2.414985 * Math.pow(10.0, -13.0)*Math.pow(frequency, 6.0)) + (1.395566 * Math.pow(10.0, -10.0)*Math.pow(frequency, 5.0)) + (-3.211147 * Math.pow(10, -8)*Math.pow(frequency, 4.0)) + (3.782657 * Math.pow(10, -6)*Math.pow(frequency, 3.0)) + (-2.443907*Math.pow(10.0, -4.0)*Math.pow(frequency, 2)) + (8.439992*Math.pow(10.0, -3)*frequency) + 0.5333428;
                 } else
						 return (-2.302718 * Math.pow(10.0, -9.0)*Math.pow(frequency, 4.0)) + (2.380355 * Math.pow(10, -6)*Math.pow(frequency, 3.0)) + (-9.153245*Math.pow(10.0, -4.0)*Math.pow(frequency, 2)) + (0.1555960*frequency) - 9.143966;
				 }
			 }
}

function naturalFrequencyCalc(loadedArea, shapeFactor, thickness, load){
    var newNaturalFrequency = 300;
    let oldNaturalFrequency = newNaturalFrequency;

    do {
        oldNaturalFrequency = newNaturalFrequency;

        //determine if out of range
        if (oldNaturalFrequency > 300) {
            // console.log('Natural Frequency exceeded 300 Hz. Please respecify parameters.');
            return 0
        }

        //Determine dynamic compressive frequency
        var dynamicCompressiveModulus = dynamicCompressiveModulusCalc(assumedDeflection, durometer, oldNaturalFrequency);
        //Calculate dynamic spring rate
        var dynamicSpringRate = (dynamicCompressiveModulus * (1 + 2 * Math.pow(shapeFactor, 2.0)) * loadedArea) / thickness;

        //Calculate new natural frequency
        newNaturalFrequency = Math.sqrt(dynamicSpringRate * 386 / load) / (2 * Math.PI);
    } while (Math.abs(newNaturalFrequency - oldNaturalFrequency) > 0.1)

    var dynamicShearModulus = dynamicCompressiveModulus/3;
    // console.log('DynamicShearModulus', dynamicShearModulus.toFixed(2));
    // console.log('DynamicCompressiveModulus', dynamicCompressiveModulus.toFixed(2));
    // console.log('DynamicSpringRate', dynamicSpringRate.toFixed(2));
    // console.log('NaturalFrequency', newNaturalFrequency.toFixed(2));
    return newNaturalFrequency;


}


function throwVibrationError(errorName){
    switch (errorName){
        case 'invalidLength':
            // console.log('Enter a number greater than zero for length.');
            break;

        case 'invalidWidth':
        // console.log('Enter a number greater than zero for width.');
        break;

        case 'invalidThickness':
        // console.log('Enter a number greater than zero for thickness.');
        break;

        case 'invalidOuterDiameter':
        // console.log('Enter a number greater than zero for outer diameter.');
        break;

        case 'invalidInnerDiameter':
        // console.log('Enter a number greater than zero for inner diameter.');
        break;

        case 'invalidInnerDiameterSize':
        // console.log('Inner diameter has to be smaller than outer diameter.');
        break;

        case 'invalidLoad':
        // console.log('Enter a number greater than zero for load.');
        break;

        case 'invalidFrequency':
        // console.log('Enter a number between 0 and 300 for excitation frequency.');
        break;

        case 'invalidVelocity':
        // console.log('Enter a number greater than zero for velocity.');
        break;

        case 'invalidHeight':
        // console.log('Enter a number greater than zero for height.');
        break;

        case 'shapeFactor':
        // console.log("Shape factor is above 1.20.\nIt is recommended to adjust geometry to correct this for more accurate results.")
        break;

        case 'deflectionOutOfRange':
        // console.log("Calculated percent deflection is not within +/-3% of the assumed.\nFor correcting, try a closer assumed deflection, differrent durometer or different geometry.")
        break;

        case 'resonating':
        // console.log("Percent isolation will be negative because the isolator is resonating.\nTry reducing shape factor of isolator to reduce its natural frequency.\nIt is also possible excitation frequency is too low to isolate.")
        break;
    }
}

let max_isolation = -999;

const weight = 320 ;
[3, 4, 5, 6, 7, 8].forEach(pieces => {
    const load = weight / pieces;

    [1,2,3,4].forEach(layers => {
        const thickness = 0.4 * layers;

        for (let length = 1; length <= 5; length += 0.1) {
            const isolation = calcuateVibration(length, thickness, load);
            if (isolation > max_isolation) {
                console.log(isolation, "isolation for", pieces, "pieces", layers, "layers", length, "inch square")
                max_isolation = isolation
            }
        }
    } )
})
