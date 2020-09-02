from ortools.sat.python import cp_model
# This program tries to find an optimal assignment of nurses to shifts
# (3 shifts per day, for 7 days), subject to some constraints (see below).
# Each nurse can request to be assigned to specific shifts.
# The optimal assignment maximizes the number of fulfilled shift requests.
import random

from testShiftRequests import *



def scheduler(shiftss):
    employees = getTable("th","employee")
    print(employees)
    print(shiftss)
    random.shuffle(employees)
    num_nurses = len(employees)
    num_shifts = len(shiftss)
    num_days = 1
    all_nurses = range(num_nurses)
    all_shifts = range(num_shifts)
    all_days = range(num_days)

    shift_requests = [[[0 for s in all_shifts] for d in all_days] for n in all_nurses]

    for n in all_nurses:
        for d in all_days:
            for s in all_shifts:
                if employees[n][4][s] == "1":
                    shift_requests[n][d][s] = 1
                if employees[n][4][s] == "2":
                    shift_requests[n][d][s] = 2

    print(shift_requests)
    for n in range(len(employees)):
        print(employees[n])



    # Creates the model.
    model = cp_model.CpModel()

    # Creates shift variables.
    # shifts[(n, d, s)]: nurse 'n' works shift 's' on day 'd'.
    shifts = {}
    for n in all_nurses:
        for d in all_days:
            for s in all_shifts:
                shifts[(n, d,
                        s)] = model.NewBoolVar('shift_n%id%is%i' % (n, d, s))

    # Each shift is assigned to exactly one nurse in .
    for d in all_days:
        for s in all_shifts:
            model.Add(sum(shifts[(n, d, s)] for n in all_nurses) == 1)

    '''# Each nurse works at most one shift per day.
    for n in all_nurses:
        for d in all_days:
            model.Add(sum(shifts[(n, d, s)] for s in all_shifts) <= 1)'''


    #if a nurse can't work a shift don't schedule them
    for n in all_nurses:
        for d in all_days:
            for s in all_shifts:
                if(shift_requests[n][d][s] == 2):
                    print(n,d,s,employees[n][0])
                    model.Add(shifts[(n, d, s)] != 1)

    # min_shifts_assigned is the largest integer such that every nurse can be
    # assigned at least that number of shifts.
    min_shifts_per_nurse = num_shifts // num_nurses#(num_shifts * num_days) // num_nurses
    max_shifts_per_nurse = min_shifts_per_nurse + 1
    for n in all_nurses:
        num_shifts_worked = sum(
            shifts[(n, d, s)] for d in all_days for s in all_shifts)
        model.Add(min_shifts_per_nurse <= num_shifts_worked)
        model.Add(num_shifts_worked <= max_shifts_per_nurse)

    print(all_nurses,all_days,all_shifts)
    print(n,d,s)
    model.Maximize(
        sum(shift_requests[n][d][s] * shifts[(n, d, s)] for n in all_nurses
            for d in all_days for s in all_shifts))
    # Creates the solver and solve.
    solver = cp_model.CpSolver()
    solver.Solve(model)
    for d in all_days:
        print('Day', d)
        for n in all_nurses:
            for s in all_shifts:
                if solver.Value(shifts[(n, d, s)]) == 1:
                    if shift_requests[n][d][s] == 1:
                        print('Nurse', employees[n][1],employees[n][2], 'works shift', s, '(requested).')
                        shiftss[s]['assignedEmployee'] = employees[n][1] + " " + employees[n][2]
                    else:
                        print('Nurse',employees[n][1],employees[n][2], 'works shift', s, '(not requested).')
                        shiftss[s]['assignedEmployee'] = employees[n][1] + " " + employees[n][2]
        print()




    # Statistics.
    print()
    print('Statistics')
    print('  - Number of shift requests met = %i' % solver.ObjectiveValue(),
          '(out of', num_nurses * min_shifts_per_nurse, ')')
    print('  - wall time       : %f s' % solver.WallTime())

    return(shiftss)


#same as abaove, but no shift limit
def scheduler2(shiftss):
    employees = getTable("th","employee")
    print(employees)
    print(shiftss)
    random.shuffle(employees)
    num_nurses = len(employees)
    num_shifts = len(shiftss)
    num_days = 1
    all_nurses = range(num_nurses)
    all_shifts = range(num_shifts)
    all_days = range(num_days)

    shift_requests = [[[0 for s in all_shifts] for d in all_days] for n in all_nurses]

    for n in all_nurses:
        for d in all_days:
            for s in all_shifts:
                if employees[n][4][s] == "1":
                    shift_requests[n][d][s] = 1
                if employees[n][4][s] == "2":
                    shift_requests[n][d][s] = 2

    print(shift_requests)
    for n in range(len(employees)):
        print(employees[n])



    # Creates the model.
    model = cp_model.CpModel()

    # Creates shift variables.
    # shifts[(n, d, s)]: nurse 'n' works shift 's' on day 'd'.
    shifts = {}
    for n in all_nurses:
        for d in all_days:
            for s in all_shifts:
                shifts[(n, d,
                        s)] = model.NewBoolVar('shift_n%id%is%i' % (n, d, s))

    # Each shift is assigned to exactly one nurse in .
    for d in all_days:
        for s in all_shifts:
            model.Add(sum(shifts[(n, d, s)] for n in all_nurses) == 1)

    '''# Each nurse works at most one shift per day.
    for n in all_nurses:
        for d in all_days:
            model.Add(sum(shifts[(n, d, s)] for s in all_shifts) <= 1)'''


    #if a nurse can't work a shift don't schedule them
    for n in all_nurses:
        for d in all_days:
            for s in all_shifts:
                if(shift_requests[n][d][s] == 2):
                    print(n,d,s,employees[n][0])
                    model.Add(shifts[(n, d, s)] != 1)


    #for e in range(len(employees)):
    #    shift_requests = employees[e].getRequests(num_days, num_shifts, shift_requests,model,shifts)

    # min_shifts_assigned is the largest integer such that every nurse can be
    # assigned at least that number of shifts.
    min_shifts_per_nurse = num_shifts // num_nurses#(num_shifts * num_days) // num_nurses
    max_shifts_per_nurse = min_shifts_per_nurse + 1
    for n in all_nurses:
        num_shifts_worked = sum(
            shifts[(n, d, s)] for d in all_days for s in all_shifts)
        model.Add(min_shifts_per_nurse <= num_shifts_worked)
    print(all_nurses,all_days,all_shifts)
    print(n,d,s)
    model.Maximize(
        sum(shift_requests[n][d][s] * shifts[(n, d, s)] for n in all_nurses
            for d in all_days for s in all_shifts))
    # Creates the solver and solve.
    solver = cp_model.CpSolver()
    solver.Solve(model)
    for d in all_days:
        print('Day', d)
        for n in all_nurses:
            for s in all_shifts:
                if solver.Value(shifts[(n, d, s)]) == 1:
                    if shift_requests[n][d][s] == 1:
                        print('Nurse', employees[n][1],employees[n][2], 'works shift', s, '(requested).')
                        shiftss[s]['assignedEmployee'] = employees[n][1] + " " + employees[n][2]
                    else:
                        print('Nurse',employees[n][1],employees[n][2], 'works shift', s, '(not requested).')
                        shiftss[s]['assignedEmployee'] = employees[n][1] + " " + employees[n][2]
        print()




    # Statistics.
    print()
    print('Statistics')
    print('  - Number of shift requests met = %i' % solver.ObjectiveValue(),
          '(out of', num_nurses * min_shifts_per_nurse, ')')
    print('  - wall time       : %f s' % solver.WallTime())

    return(shiftss)
