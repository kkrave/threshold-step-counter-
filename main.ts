datalogger.onLogFull(function () {
    logging = false
    basic.showLeds(`
        # # # # #
        # # # # #
        # # # # #
        # # # # #
        # # # # #
        `)
})
input.onButtonPressed(Button.A, function () {
    logging = true
    whaleysans.showNumber(steps)
})
input.onButtonPressed(Button.AB, function () {
    steps = 0
    logging = false
    datalogger.deleteLog(datalogger.DeleteType.Full)
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        # # # # #
        `)
})
function detectCooldown () {
    return input.runningTime() - last_step_timems > cooldown_timems
}
input.onButtonPressed(Button.B, function () {
    logging = false
    basic.showLeds(`
        . . . . .
        . # . # .
        . # . # .
        . # . # .
        . . . . .
        `)
})
function detectThresholdCrossing () {
    A = threshold_variable > threshold_value
    B = threshold_value < 0
    A_XOR_B = !(A) && B || A && !(B)
    return A_XOR_B
}
function Set_Threshold_Variables () {
    threshold_variable = 0
    threshold_value = 0
    sample_delayms = 0
    cooldown_timems = 0
}
let sample_delayms = 0
let A_XOR_B = false
let B = false
let threshold_value = 0
let threshold_variable = 0
let A = false
let cooldown_timems = 0
let last_step_timems = 0
let logging = false
let steps = 0
steps = 0
logging = false
basic.showLeds(`
    . . . . #
    . . # . #
    . . # . #
    . # # . #
    # # # # #
    `)
datalogger.setColumnTitles(
"Accel.X",
"Accel.Y",
"Accel.Z",
"Accel.STR",
"Steps"
)
datalogger.deleteLog(datalogger.DeleteType.Full)
basic.forever(function () {
    while (logging) {
        Set_Threshold_Variables()
        if (detectThresholdCrossing() && detectCooldown()) {
            steps += 1
            last_step_timems = input.runningTime()
            whaleysans.showNumber(steps)
        }
        datalogger.log(
        datalogger.createCV("Accel.X", input.acceleration(Dimension.X)),
        datalogger.createCV("Accel.Y", input.acceleration(Dimension.Y)),
        datalogger.createCV("Accel.Z", input.acceleration(Dimension.Z)),
        datalogger.createCV("Accel.STR", input.acceleration(Dimension.Strength)),
        datalogger.createCV("Steps", steps)
        )
        basic.pause(sample_delayms)
    }
})
