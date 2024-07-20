import itertools
import random
from collections import defaultdict

def create_groups(participants, group_size, num_rounds):
    num_participants = len(participants)
    groups_per_round = num_participants // group_size
    extra_participants = num_participants % group_size

    if groups_per_round == 0:
        raise ValueError("グループサイズが参加者数よりも大きいです。")

    all_combinations = list(itertools.combinations(participants, group_size))
    all_groups = []
    leftover_participants_per_round = []

    used_combinations = set()

    # 各メンバーが余りのメンバーとして選ばれた回数を記録する
    leftover_count = defaultdict(int)

    def generate_round(participants_for_grouping):
        round_groups = []
        available_combinations = [c for c in all_combinations if c not in used_combinations]
        if len(available_combinations) < groups_per_round:
            return None, list(itertools.chain.from_iterable(round_groups))
        
        random.shuffle(available_combinations)
        for _ in range(groups_per_round):
            if not available_combinations:
                return None, list(itertools.chain.from_iterable(round_groups))
            group = available_combinations.pop()
            round_groups.append(group)
            used_combinations.add(group)
        return round_groups, list(itertools.chain.from_iterable(round_groups))

    for _ in range(num_rounds):
        # 各メンバーの余り回数に基づいて余りメンバーを決定する
        participants_with_weights = [(p, leftover_count[p]) for p in participants]
        participants_with_weights.sort(key=lambda x: x[1])
        
        num_leftovers = random.randint(0, group_size - 1) if extra_participants == 0 else extra_participants
        if num_leftovers > 0:
            leftover_participants = [p for p, _ in participants_with_weights[:num_leftovers]]
        else:
            leftover_participants = []
        
        # 選ばれた余りのメンバーを記録する
        for p in leftover_participants:
            leftover_count[p] += 1
        
        participants_for_grouping = [p for p in participants if p not in leftover_participants]

        # グループ作成
        round_groups, used_participants = generate_round(participants_for_grouping)
        if round_groups is None:
            break
        
        all_groups.append(round_groups)
        leftover_participants_per_round.append(leftover_participants)
        
        # 次回の周で余ったメンバーを優先的に選出する
        participants = leftover_participants.copy() + [p for p in participants if p not in leftover_participants]

    # 最後に、各ラウンドで余ったメンバーを表示
    for i, leftovers in enumerate(leftover_participants_per_round, start=1):
        print(f"Round {i} の余ったメンバー: {leftovers}")

    return all_groups

def main():
    # 参加者数とグループ数を入力
    num_participants = int(input("参加者数を入力してください: "))
    group_size = int(input("グループのサイズを入力してください: "))
    num_rounds = int(input("周の数を入力してください: "))

    # 参加者リストを生成
    participants = [f"Participant_{i+1}" for i in range(num_participants)]

    # グループ作成
    rounds = create_groups(participants, group_size, num_rounds)
    
    # 結果表示
    for i, round_groups in enumerate(rounds, start=1):
        print(f"Round {i}:")
        for group in round_groups:
            print(f"  Group: {group}")

if __name__ == "__main__":
    main()
