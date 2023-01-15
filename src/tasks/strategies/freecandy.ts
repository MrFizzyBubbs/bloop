import { myAdventures, myInebriety, myTurncount } from "kolmafia";
import { $familiar, $item, get, set, withProperty } from "libram";
import { canConsume, cliExecuteThrow, stooperInebrietyLimit } from "../../lib";
import { caldera, stooper } from "./common";
import { Strategy } from "./strategy";

export function freecandy(): Strategy {
  return {
    tasks: (ascend: boolean, after: string[]) => [
      {
        name: "Garboween",
        after: after,
        completed: () => get("_garboCompleted", "") !== "" && !canConsume(),
        do: () => cliExecuteThrow(`garboween yachtzeechain ${ascend ? "ascend" : ""}`),
        limit: { tries: 1 },
        tracking: "Garbo",
      },
      {
        name: "Freecandy",
        after: [...after, "Garboween"],
        completed: () => myAdventures() < 5 || myInebriety() >= stooperInebrietyLimit(),
        prepare: () => set("freecandy_treatOutfit", "Ceramic Suit"),
        do: () => cliExecuteThrow("freecandy"),
        outfit: {
          familiar: $familiar`Reagnimated Gnome`,
          famequip: $item`gnomish housemaid's kgnee`,
        },
        limit: { tries: 1 },
        tracking: "Freecandy",
      },
      stooper([...after, "Freecandy"]),
      {
        name: "Overdrink",
        after: [...after, "Stooper"],
        completed: () => myInebriety() > stooperInebrietyLimit(),
        do: () =>
          withProperty("spiceMelangeUsed", true, () =>
            cliExecuteThrow(`CONSUME NIGHTCAP ${ascend ? "NOMEAT" : ""}`)
          ),
        outfit: { familiar: $familiar`Stooper` },
        limit: { tries: 1 },
      },
      ...(ascend ? [caldera([...after, "Overdrink"])] : []),
      {
        name: "Overdrunk",
        after: [...after, "Overdrink"],
        ready: () => myInebriety() > stooperInebrietyLimit(),
        completed: () => myAdventures() < 5,
        prepare: () => set("freecandy_treatOutfit", "Ceramic Suit"),
        do: () => cliExecuteThrow("freecandy"),
        outfit: {
          familiar: $familiar`Reagnimated Gnome`,
          famequip: $item`gnomish housemaid's kgnee`,
        },
        limit: { tries: 1 },
        tracking: "Freecandy",
      },
      ...(ascend
        ? [
            {
              name: "Combo",
              after: [...after, "Overdrunk"],
              completed: () => myAdventures() === 0,
              do: () => cliExecuteThrow(`combo ${myAdventures()}`),
              limit: { tries: 1 },
            },
          ]
        : []),
    ],
    gyou: {
      pulls: [
        $item`porcelain porkpie`,
        $item`porcelain pelerine`,
        $item`porcelain police baton`,
        $item`porcelain pepper mill`,
        $item`porcelain plus-fours`,
        $item`porcelain phantom mask`,
        $item`beholed bedsheet`,
      ],
      ronin: {
        prepare: () => set("freecandy_treatOutfit", "Ceramic Suit"),
        do: () => cliExecuteThrow(`freecandy ${Math.ceil((1000 - myTurncount()) / 5)}`),
        outfit: {
          familiar: $familiar`Reagnimated Gnome`,
          famequip: $item`gnomish housemaid's kgnee`,
        },
      },
      postronin: {
        prepare: () => set("freecandy_treatOutfit", "Ceramic Suit"),
        do: () => cliExecuteThrow(`freecandy ${Math.ceil((myAdventures() - 40) / 5)}`),
        outfit: {
          familiar: $familiar`Reagnimated Gnome`,
          famequip: $item`gnomish housemaid's kgnee`,
        },
      },
    },
  };
}
