import { cliExecute, getWorkshed, myAdventures, myPath, use, visitUrl } from "kolmafia";
import {
  $effect,
  $item,
  $path,
  $skill,
  ascend,
  AsdonMartin,
  get,
  have,
  Lifestyle,
  prepareAscension,
} from "libram";
import { ascendedToday, createPermOptions } from "../lib";
import { breakfast, breakStone, duffo, endOfDay } from "./common";
import { chooseStrategy } from "../strategies/strategy";
import { args } from "../args";
import { LoopQuest } from "../engine/engine";

export function casualQuest(): LoopQuest {
  const strategy = chooseStrategy();
  return {
    name: "Casual",
    tasks: [
      {
        name: "Ascend",
        completed: () => ascendedToday(),
        do: (): void => {
          prepareAscension({
            garden: "packet of thanksgarden seeds",
            eudora: "New-You Club Membership Form",
            chateau: {
              desk: "Swiss piggy bank",
              nightstand: (
                {
                  Muscle: "electric muscle stimulator",
                  Mysticality: "foreign language tapes",
                  Moxie: "bowl of potpourri",
                } as const
              )[args.major.class.primestat.toString()],
              ceiling: "ceiling fan",
            },
          });
          visitUrl("council.php"); // Collect thwaitgold
          ascend(
            $path`none`,
            args.major.class,
            Lifestyle.casual,
            "knoll",
            $item`astral six-pack`,
            $item`astral pet sweater`,
            createPermOptions()
          );
        },
        limit: { tries: 1 },
      },
      breakStone(),
      ...duffo([]),
      {
        name: "Run",
        ready: () => myPath() === $path`none`,
        completed: () => get("kingLiberated") && have($skill`Liver of Steel`),
        do: (): void => {
          cliExecute("loopcasual fluffers=false stomach=15 workshed='Asdon Martin keyfob'");
          if (myAdventures() === 0 && !have($skill`Liver of Steel`)) {
            cliExecute("cast 2 ancestral recall");
            cliExecute("loopcasual fluffers=false stomach=15");
          }
        },
        limit: { tries: 1 },
        tracking: "Run",
      },
      {
        name: "Workshed",
        completed: () => get("_workshedItemUsed") || getWorkshed() === $item`cold medicine cabinet`,
        do: (): void => {
          AsdonMartin.drive($effect`Driving Observantly`, 1000);
          use($item`cold medicine cabinet`);
        },
        limit: { tries: 1 },
      },
      ...breakfast(),
      ...strategy.tasks(false),
      ...endOfDay(),
    ],
  };
}
