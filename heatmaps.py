import glob
import json

import sc2reader
from sc2reader.engine.plugins import ContextLoader, APMTracker
from sc2reader.engine.plugins import SelectionTracker, GameHeartNormalizer


def classify_matchup(replay):
    races = []
    for player in replay.players:
        races.append(player.play_race)
    matchup = "v".join(race[0] for race in sorted(races))
    return matchup


if __name__ == "__main__":

    data = []
    replays = glob.glob("all_replays/**/*.SC2Replay", recursive=True)
    for filename in replays:
        replay = sc2reader.load_replay(
            filename,
            engine=sc2reader.engine.GameEngine(plugins=[
                APMTracker(),
                SelectionTracker(),
                ContextLoader(),
                GameHeartNormalizer(),
            ])
        )
        #game['matchup'] = replay.matchup
        for human in replay.players:
            game = {}
            game['length'] = replay.frames / 22.4
            game['map'] = replay.map_name
            game['matchup'] = classify_matchup(replay)
            game['name'] = human.name
            game['race'] = human.play_race
            game['players'] = str(replay.players)
            game['buildings'] = {}
            game['buildings']['stargates'] = []
            for unit in human.units:
                if unit.name == 'Stargate':
                    gate = {}
                    gate['name'] = "Stargate"
                    gate['location'] = unit.location
                    gate['finished_at'] = unit.finished_at
                    game['buildings']['stargates'].append(gate)

            # Korean Language maps are small in number and break stuff, leave them out
            if 'LE' not in replay.map_name:
                continue
            data.append(game)

    print(json.dumps(data))
