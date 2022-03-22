import sys


class ManageSchedule:
    def __init__( self, n, schedule, name ):
        self.n = n
        self.name = name
        self.schedule = schedule
        self.idx_sch = None
        self.sch_idx = None
        self.acc_info = None
        self.acc = None

        self.time_ppl = None

    def init_set( self ):
        res = set()
        for times in self.schedule:
            for tt in times:
                res |= set(tt)
        return res

    def init_accumulation( self ):
        for i, times in enumerate(self.schedule):
            for start, end in times:
                self.acc_info[self.sch_idx[start]][0].append(i)
                self.acc_info[self.sch_idx[end]][1].append(i)
                self.acc[self.sch_idx[start]] += 1
                self.acc[self.sch_idx[end]] -= 1

    def accumulation( self ):
        res_acc = [0]
        res_acc_info = []
        member = set()
        for i in range(len(self.acc)):
            res_acc.append(res_acc[-1] + self.acc[i])
            member |= set(self.acc_info[i][0])
            member -= set(self.acc_info[i][1])
            res_acc_info.append(list(member))

        return res_acc, res_acc_info

    def result( self, lst_sch ):
        time = []
        ppl = []
        for i in range(len(lst_sch) - 1):
            time.append((lst_sch[i], lst_sch[i + 1]))
            ppl.append([])
            for j in self.acc_info[i]:
                ppl[-1].append(self.name[j])
        return time, ppl

    def main( self ):
        sets = self.init_set()
        lst_sch = list(sets)
        lst_sch.sort()
        self.idx_sch = {_: lst_sch[_] for _ in range(len(lst_sch))}
        self.sch_idx = {lst_sch[_]: _ for _ in range(len(lst_sch))}
        self.acc = [0 for _ in range(len(lst_sch))]
        self.acc_info = [[[], []] for _ in range(len(lst_sch))]
        self.init_accumulation()
        self.acc, self.acc_info = self.accumulation()

        time, ppl = self.result(lst_sch)
        self.time_ppl = (time, ppl)


def user_input():
    n = int(input("Enter number of People"))
    name = [input("Enter Name : ") for _ in range(n)]
    schedule = [[] for _ in range(n)]
    print("ex) 10:10,10:50")
    for _ in range(n):
        print(name[_])
        tmp = "temp"
        while True:
            tmp = input("Enter available time : ")
            if tmp == "":
                break
            tmp = tmp.split(",")
            se = []
            for i in tmp:
                tmp2 = list(map(int, i.split(":")))
                se.append((tmp2[0] * 60 + tmp2[1]))
            schedule[_].append(se)
    return n, name, schedule


def main():
    # ログっぽく出力するやつ
    # print("sets :", sets, file=sys.stderr)
    """n = 3
    name = ["0", "1", "2"]
    schedule = [[(0, 3), (5, 10)],
                [(2, 7)],
                [(5, 7)]]"""
    n, name, schedule = user_input()
    manager = ManageSchedule(n, schedule, name)
    manager.main()
    time, ppl = manager.time_ppl
    for i in range(len(time)):
        print(f"---------------------\n{time[i][0]} ~ {time[i][1]}\nAvailable : {' '.join(ppl[i])}")
    print("---------------------")


if __name__ == '__main__':
    main()
