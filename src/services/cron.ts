import cron, { ScheduledTask } from "node-cron";

// The CronService class provides methods to schedule and run tasks using cron expressions.

// Cron syntax reference:
// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *

// Field Ranges:
// - second: 0-59
// - minute: 0-59
// - hour: 0-23
// - day of month: 1-31
// - month: 1-12 (or names)
// - day of week: 0-7 (or names, 0 or 7 are Sunday)

type TDayOfTheWeek =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export class CronService {
  private everyMinuteTask?: ScheduledTask;
  private everyXMinutesTask?: ScheduledTask;
  private everyXHoursTask?: ScheduledTask;
  private specificTimeTask?: ScheduledTask;
  private specificTimeForSpecificDayTask?: ScheduledTask;

  /**
   * Runs a task every minute.
   * @param funcToRun - The function to be executed every minute.
   */
  runTaskEveryMinute(funcToRun?: Function) {
    const currentSecond = new Date().getSeconds();
    this.everyMinuteTask = cron.schedule(
      `${currentSecond} * * * * *`,
      async () => {
        if (funcToRun) {
          console.log("Running every minute!");
          await funcToRun();
        }
      }
    );
  }

  /**
   * Runs a task every X minutes.
   * @param minute - The interval in minutes.
   * @param funcToRun - The function to be executed at the specified interval.
   */
  runTaskEveryXMinutes(minute: string, funcToRun?: Function) {
    this.everyXMinutesTask = cron.schedule(`*/${minute} * * * *`, async () => {
      if (funcToRun) {
        console.log(`Running every ${minute} minutes!`);
        await funcToRun();
      }
    });
  }

  /**
   * Runs a task every X hours.
   * @param hour - The interval in hours.
   * @param funcToRun - The function to be executed at the specified interval.
   */
  runTaskEveryXHours(hour: string, funcToRun?: Function) {
    this.everyXHoursTask = cron.schedule(`0 ${hour} * * *`, async () => {
      if (funcToRun) {
        await funcToRun();
        console.log(`Running every ${hour} hours!`);
      }
    });
  }

  /**
   * Runs a task at a specific time of the day.
   * @param time - The time in HH:mm format.
   * @param funcToRun - The function to be executed at the specified time.
   */
  runTaskAtSpecificTime(time: string = "9:30", funcToRun?: Function) {
    const [hour, minute] = time.split(":");
    this.specificTimeTask = cron.schedule(
      `${minute} ${hour} * * *`,
      async () => {
        if (funcToRun) {
          await funcToRun();
          console.log(`Running every ${time}!`);
        }
      }
    );
  }

  /**
   * Runs a task at a specific time on a specific day.
   * @param time - The time in HH:mm format.
   * @param day - The day of the week (e.g., "monday").
   * @param funcToRun - The function to be executed at the specified time and day.
   */
  runTaskAtSpecificTimeForSpecificDay(
    time: string = "9:30",
    day: TDayOfTheWeek = "monday",
    funcToRun?: Function
  ) {
    const [hour, minute] = time.split(":");
    this.specificTimeForSpecificDayTask = cron.schedule(
      `${minute} ${hour} * * ${day}`,
      async () => {
        if (funcToRun) {
          await funcToRun();
          console.log(`Running every ${day} at ${time}!`);
        }
      }
    );
  }

  /**
   * Stops the task scheduled to run every minute.
   */
  stopEveryMinuteTask() {
    if (this.everyMinuteTask) {
      this.everyMinuteTask.stop();
      this.everyMinuteTask = undefined;
      return {
        status: 200,
        message: "Cron stopped successfully",
      };
    }
    return {
      status: 400,
      message: "Sorry you don't have an active task for stopEveryMinuteTask",
    };
  }

  /**
   * Stops the task scheduled to run every X minutes.
   */
  stopEveryXMinutesTask() {
    if (this.everyXMinutesTask) {
      this.everyXMinutesTask.stop();
      this.everyXMinutesTask = undefined;
      return {
        status: 200,
        message: "Cron stopped successfully",
      };
    }

    return {
      status: 400,
      message: "Sorry you don't have an active task for stopEveryXMinutesTask",
    };
  }

  /**
   * Stops the task scheduled to run every X hours.
   */
  stopEveryXHoursTask() {
    if (this.everyXHoursTask) {
      this.everyXHoursTask.stop();
      this.everyXHoursTask = undefined;
      return {
        status: 200,
        message: "Cron stopped successfully",
      };
    }
    return {
      status: 400,
      message: "Sorry you don't have an active task for stopEveryXHoursTask",
    };
  }

  /**
   * Stops the task scheduled to run at a specific time of the day.
   */
  stopSpecificTimeTask() {
    if (this.specificTimeTask) {
      this.specificTimeTask.stop();
      this.specificTimeTask = undefined;
      return {
        status: 200,
        message: "Cron stopped successfully",
      };
    }
    return {
      status: 400,
      message: "Sorry you don't have an active task for stopSpecificTimeTask",
    };
  }

  /**
   * Stops the task scheduled to run at a specific time on a specific day.
   */
  stopSpecificTimeForSpecificDayTask() {
    if (this.specificTimeForSpecificDayTask) {
      this.specificTimeForSpecificDayTask.stop();
      this.specificTimeForSpecificDayTask = undefined;
      return {
        status: 200,
        message: "Cron stopped successfully",
      };
    }
    return {
      status: 400,
      message:
        "Sorry you don't have an active task for stopSpecificTimeForSpecificDayTask",
    };
  }
}
