from flask import Flask, render_template, request, jsonify
import random
import os

app = Flask(__name__)

def generate_combinations(members,groups_per_week, weeks):
    group_size = 4
    
    total_members = len(members)
    
    # Tracking used combinations
    member_combinations = {member: set() for member in members}
    all_weeks_combinations = []
    not_leftover_members = members[:]
    
    for week in range(weeks):
        random.shuffle(members)
        remaining_members = members[:]
        flag = False
        if total_members-(group_size*groups_per_week) < len(not_leftover_members):
            leftover_members = not_leftover_members[:total_members-(group_size*groups_per_week)]
        else:
            flag = True
            #print("休む人リセット！！！")
            #まだ休んでない人をleftover_membersに追加(*)
            leftover_members = not_leftover_members[:]
            #(**)で削除した後に以下の配列を再度追加する。理由は、休む回数が一回少なくなるから
            add_member_after_remove_leftover = leftover_members[:]
            #not_leftover_membersをリセットしてシャッフル
            not_leftover_members = members[:]
            random.shuffle(not_leftover_members)
            #leftover_membersに休んで欲しい人数-(*)で追加した人数だけnot_leftover_membersから追加
            
            #not_leftover_membersのうちleftover_memberに追加されていない人を追加
            count = 0
            while(len(leftover_members) < total_members-(group_size*groups_per_week)):
                if not not_leftover_members[count] in leftover_members:
                    leftover_members.append(not_leftover_members[count])
                count += 1
        
        #print("休む人；：：",leftover_members)
        #休む人を配列から削除する(**)
        for leftover_member in leftover_members:
            remaining_members.remove(leftover_member)
            not_leftover_members.remove(leftover_member)
        if flag:
            for add_member in add_member_after_remove_leftover:
                remaining_members.append(add_member)
                not_leftover_members.append(add_member)
            flag = False
        week_combination = []
        
        def can_group(member, group):
            return all(other_member not in member_combinations[member] for other_member in group)
        
        def create_groups(remaining, groups):
            if len(groups) == groups_per_week:
                return groups
            
            if not remaining and groups:
                return None

            for i in range(len(remaining)):
                group = [remaining[i]]
                for j in range(i + 1, len(remaining)):
                    if len(group) < group_size and can_group(remaining[j], group):
                        group.append(remaining[j])
                        
                        if len(group) == group_size:
                            new_remaining = [m for m in remaining if m not in group]
                            result = create_groups(new_remaining, groups + [group])
                            if result:
                                return result
                
                if len(group) < group_size:
                    # If we exit loop with group not full, it means we couldn't find valid group
                    group.clear()
            
            return None
        
        # Find valid groups for the week
        groups = create_groups(remaining_members, [])
        
        if not groups:
            """
            print("member_combinationリセット")
            print("remainning", remaining_members)
            print()
            """
            member_combinations = {member: set() for member in members}
            groups = create_groups(remaining_members, [])
        
        for group in groups:
            week_combination.append(group)
            for member in group:
                member_combinations[member].update(group)
        print(week_combination)
        #print()
        all_weeks_combinations.append((week_combination, leftover_members))
    #print(not_leftover_members)
    return all_weeks_combinations

def main(members, weeks, groups_per_week):
    all_weeks_combinations = generate_combinations(members,groups_per_week, weeks)
    return all_weeks_combinations

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/post", methods=['POST'])
def recieve_data():
    data = request.get_json()
    print(data)
    members = data["members"]
    weeks = data["weeks"]
    groups_per_week = data["groups_per_week"]
    print(weeks, groups_per_week)
    print("members:::", members)
    return jsonify({"status": "success", "data": main(members, weeks, groups_per_week)})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)