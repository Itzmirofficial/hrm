"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"

// Define types for all entities
export type Company = {
  id: number
  code: string
  name: string
  email: string
  phone: string
  address: string
  gstNo?: string
  pan?: string
  website?: string
  logo?: string
}

export type Department = {
  id: number
  code: string
  name: string
  companyId: number
  description?: string
}

export type Category = {
  id: number
  code: string
  name: string
  description?: string
}

export type Designation = {
  id: number
  code: string
  name: string
  departmentId: number
  description?: string
}

export type Shift = {
  id: number
  code: string
  name: string
  startTime: string
  endTime: string
  gracePeriod?: number
  workingHours: number
  isActive: boolean
}

export type Holiday = {
  id: number
  date: Date
  name: string
  description?: string
  isOptional: boolean
}

export type LeaveType = {
  id: number
  code: string
  name: string
  description?: string
  allowedDays: number
  carryForward: boolean
  maxCarryForwardDays?: number
}

export type Employee = {
  id: number
  machineCode: string
  employeeCode: string
  name: string
  hireDate: Date
  gender: "male" | "female"
  departmentId: number
  categoryId: number
  designationId: number
  shiftId: number
  otEligible: boolean
  autoShift: boolean
  resigned: boolean
  // Personal details
  qualification?: string
  experience?: string
  previousCompany?: string
  email?: string
  permanentAddress?: string
  city?: string
  state?: string
  country?: string
  phone?: string
  mobile?: string
  bloodGroup?: string
  height?: string
  weight?: string
  abhaNumber?: string
  aadharCardNo?: string
  dob?: Date
  bankAccountNo?: string
  bankName?: string
  remarks?: string
}

export type LeaveApplication = {
  id: number
  employeeId: number
  leaveTypeId: number
  startDate: Date
  endDate: Date
  dayDuration: "full" | "half"
  remarks?: string
  status: "Pending" | "Approved" | "Rejected"
  appliedOn: Date
}

export type ManualEntry = {
  id: number
  employeeId: number
  date: Date
  inTime?: string
  outTime?: string
  remarks?: string
}

export type Attendance = {
  id: number
  employeeId: number
  date: Date
  inTime: string
  outTime?: string
  status: "Present" | "Absent" | "Half Day" | "On Leave"
  lateMinutes?: number
  earlyDepartureMinutes?: number
  overtimeHours?: number
}

// Context type
type HRMSContextType = {
  // Data
  companies: Company[]
  departments: Department[]
  categories: Category[]
  designations: Designation[]
  shifts: Shift[]
  holidays: Holiday[]
  leaveTypes: LeaveType[]
  employees: Employee[]
  leaveApplications: LeaveApplication[]
  manualEntries: ManualEntry[]
  attendances: Attendance[]

  // CRUD operations
  addCompany: (company: Omit<Company, "id">) => void
  updateCompany: (id: number, company: Partial<Company>) => void
  deleteCompany: (id: number) => void

  addDepartment: (department: Omit<Department, "id">) => void
  updateDepartment: (id: number, department: Partial<Department>) => void
  deleteDepartment: (id: number) => void

  addCategory: (category: Omit<Category, "id">) => void
  updateCategory: (id: number, category: Partial<Category>) => void
  deleteCategory: (id: number) => void

  addDesignation: (designation: Omit<Designation, "id">) => void
  updateDesignation: (id: number, designation: Partial<Designation>) => void
  deleteDesignation: (id: number) => void

  addShift: (shift: Omit<Shift, "id">) => void
  updateShift: (id: number, shift: Partial<Shift>) => void
  deleteShift: (id: number) => void

  addHoliday: (holiday: Omit<Holiday, "id">) => void
  updateHoliday: (id: number, holiday: Partial<Holiday>) => void
  deleteHoliday: (id: number) => void

  addLeaveType: (leaveType: Omit<LeaveType, "id">) => void
  updateLeaveType: (id: number, leaveType: Partial<LeaveType>) => void
  deleteLeaveType: (id: number) => void

  addEmployee: (employee: Omit<Employee, "id">) => void
  updateEmployee: (id: number, employee: Partial<Employee>) => void
  deleteEmployee: (id: number) => void

  addLeaveApplication: (leaveApplication: Omit<LeaveApplication, "id" | "appliedOn" | "status">) => void
  updateLeaveApplication: (id: number, leaveApplication: Partial<LeaveApplication>) => void
  deleteLeaveApplication: (id: number) => void
  approveLeaveApplication: (id: number) => void
  rejectLeaveApplication: (id: number) => void

  addManualEntry: (manualEntry: Omit<ManualEntry, "id">) => void
  updateManualEntry: (id: number, manualEntry: Partial<ManualEntry>) => void
  deleteManualEntry: (id: number) => void

  // Helper functions
  getDepartmentById: (id: number) => Department | undefined
  getCategoryById: (id: number) => Category | undefined
  getDesignationById: (id: number) => Designation | undefined
  getShiftById: (id: number) => Shift | undefined
  getEmployeeById: (id: number) => Employee | undefined
  getLeaveTypeById: (id: number) => LeaveType | undefined
  getCompanyById: (id: number) => Company | undefined
}

// Create context
const HRMSContext = createContext<HRMSContextType | undefined>(undefined)

// Sample data
const sampleCompanies: Company[] = [
  {
    id: 1,
    code: "ABC123",
    name: "ABC Corporation",
    email: "contact@abc.com",
    phone: "123-456-7890",
    address: "123 Main St, City, Country",
  },
  {
    id: 2,
    code: "XYZ456",
    name: "XYZ Industries",
    email: "info@xyz.com",
    phone: "987-654-3210",
    address: "456 Business Ave, City, Country",
  },
  {
    id: 3,
    code: "LMN789",
    name: "LMN Solutions",
    email: "support@lmn.com",
    phone: "555-123-4567",
    address: "789 Tech Park, City, Country",
  },
  {
    id: 4,
    code: "PQR321",
    name: "PQR Technologies",
    email: "hello@pqr.com",
    phone: "222-333-4444",
    address: "321 Innovation St, City, Country",
  },
  {
    id: 5,
    code: "EFG654",
    name: "EFG Enterprises",
    email: "sales@efg.com",
    phone: "777-888-9999",
    address: "654 Corporate Blvd, City, Country",
  },
]

const sampleDepartments: Department[] = [
  { id: 1, code: "IT", name: "Information Technology", companyId: 1, description: "IT department" },
  { id: 2, code: "HR", name: "Human Resources", companyId: 1, description: "HR department" },
  { id: 3, code: "FIN", name: "Finance", companyId: 1, description: "Finance department" },
  { id: 4, code: "MKT", name: "Marketing", companyId: 1, description: "Marketing department" },
  { id: 5, code: "OPS", name: "Operations", companyId: 1, description: "Operations department" },
]

const sampleCategories: Category[] = [
  { id: 1, code: "PERM", name: "Permanent", description: "Permanent employees" },
  { id: 2, code: "CONT", name: "Contract", description: "Contract employees" },
  { id: 3, code: "INTR", name: "Intern", description: "Interns" },
  { id: 4, code: "TEMP", name: "Temporary", description: "Temporary employees" },
  { id: 5, code: "CONS", name: "Consultant", description: "Consultants" },
]

const sampleDesignations: Designation[] = [
  { id: 1, code: "DEV", name: "Developer", departmentId: 1, description: "Software Developer" },
  { id: 2, code: "MGR", name: "Manager", departmentId: 2, description: "Department Manager" },
  { id: 3, code: "DIR", name: "Director", departmentId: 3, description: "Department Director" },
  { id: 4, code: "ANLST", name: "Analyst", departmentId: 1, description: "Business Analyst" },
  { id: 5, code: "DSGN", name: "Designer", departmentId: 4, description: "UI/UX Designer" },
]

const sampleShifts: Shift[] = [
  {
    id: 1,
    code: "MORN",
    name: "Morning Shift",
    startTime: "06:00",
    endTime: "14:00",
    gracePeriod: 15,
    workingHours: 8,
    isActive: true,
  },
  {
    id: 2,
    code: "DAY",
    name: "Day Shift",
    startTime: "09:00",
    endTime: "17:00",
    gracePeriod: 15,
    workingHours: 8,
    isActive: true,
  },
  {
    id: 3,
    code: "EVE",
    name: "Evening Shift",
    startTime: "14:00",
    endTime: "22:00",
    gracePeriod: 15,
    workingHours: 8,
    isActive: true,
  },
  {
    id: 4,
    code: "NIGHT",
    name: "Night Shift",
    startTime: "22:00",
    endTime: "06:00",
    gracePeriod: 15,
    workingHours: 8,
    isActive: true,
  },
  {
    id: 5,
    code: "FLEX",
    name: "Flexible Shift",
    startTime: "08:00",
    endTime: "18:00",
    gracePeriod: 30,
    workingHours: 8,
    isActive: true,
  },
]

const sampleHolidays: Holiday[] = [
  {
    id: 1,
    date: new Date("2023-01-01"),
    name: "New Year's Day",
    description: "New Year's Day celebration",
    isOptional: false,
  },
  {
    id: 2,
    date: new Date("2023-05-01"),
    name: "Labor Day",
    description: "International Workers' Day",
    isOptional: false,
  },
  {
    id: 3,
    date: new Date("2023-08-15"),
    name: "Independence Day",
    description: "National Independence Day",
    isOptional: false,
  },
  {
    id: 4,
    date: new Date("2023-10-02"),
    name: "Gandhi Jayanti",
    description: "Birth anniversary of Mahatma Gandhi",
    isOptional: false,
  },
  {
    id: 5,
    date: new Date("2023-12-25"),
    name: "Christmas",
    description: "Christmas Day celebration",
    isOptional: false,
  },
]

const sampleLeaveTypes: LeaveType[] = [
  {
    id: 1,
    code: "CL",
    name: "Casual Leave",
    description: "For personal matters and emergencies",
    allowedDays: 12,
    carryForward: false,
  },
  {
    id: 2,
    code: "SL",
    name: "Sick Leave",
    description: "For health issues and medical treatment",
    allowedDays: 12,
    carryForward: false,
  },
  {
    id: 3,
    code: "AL",
    name: "Annual Leave",
    description: "Yearly vacation leave",
    allowedDays: 20,
    carryForward: true,
    maxCarryForwardDays: 5,
  },
  {
    id: 4,
    code: "ML",
    name: "Maternity Leave",
    description: "For female employees during childbirth",
    allowedDays: 180,
    carryForward: false,
  },
  {
    id: 5,
    code: "PL",
    name: "Paternity Leave",
    description: "For male employees during childbirth",
    allowedDays: 15,
    carryForward: false,
  },
]

const sampleEmployees: Employee[] = [
  {
    id: 1,
    machineCode: "M001",
    employeeCode: "EMP001",
    name: "John Smith",
    hireDate: new Date("2020-01-15"),
    gender: "male",
    departmentId: 1,
    categoryId: 1,
    designationId: 1,
    shiftId: 2,
    otEligible: true,
    autoShift: false,
    resigned: false,
    email: "john.smith@example.com",
    mobile: "9876543210",
  },
  {
    id: 2,
    machineCode: "M002",
    employeeCode: "EMP002",
    name: "Sarah Johnson",
    hireDate: new Date("2019-05-20"),
    gender: "female",
    departmentId: 2,
    categoryId: 1,
    designationId: 2,
    shiftId: 2,
    otEligible: false,
    autoShift: false,
    resigned: false,
    email: "sarah.johnson@example.com",
    mobile: "8765432109",
  },
  {
    id: 3,
    machineCode: "M003",
    employeeCode: "EMP003",
    name: "Mike Thompson",
    hireDate: new Date("2021-03-10"),
    gender: "male",
    departmentId: 3,
    categoryId: 1,
    designationId: 3,
    shiftId: 2,
    otEligible: false,
    autoShift: false,
    resigned: false,
    email: "mike.thompson@example.com",
    mobile: "7654321098",
  },
  {
    id: 4,
    machineCode: "M004",
    employeeCode: "EMP004",
    name: "Emily Davis",
    hireDate: new Date("2022-01-05"),
    gender: "female",
    departmentId: 4,
    categoryId: 1,
    designationId: 5,
    shiftId: 2,
    otEligible: true,
    autoShift: false,
    resigned: false,
    email: "emily.davis@example.com",
    mobile: "6543210987",
  },
  {
    id: 5,
    machineCode: "M005",
    employeeCode: "EMP005",
    name: "Robert Wilson",
    hireDate: new Date("2020-11-15"),
    gender: "male",
    departmentId: 1,
    categoryId: 1,
    designationId: 1,
    shiftId: 4,
    otEligible: true,
    autoShift: false,
    resigned: false,
    email: "robert.wilson@example.com",
    mobile: "5432109876",
  },
]

const sampleLeaveApplications: LeaveApplication[] = [
  {
    id: 1,
    employeeId: 1,
    leaveTypeId: 1,
    startDate: new Date("2023-10-15"),
    endDate: new Date("2023-10-17"),
    dayDuration: "full",
    remarks: "Personal work",
    status: "Approved",
    appliedOn: new Date("2023-10-01"),
  },
  {
    id: 2,
    employeeId: 2,
    leaveTypeId: 2,
    startDate: new Date("2023-11-05"),
    endDate: new Date("2023-11-07"),
    dayDuration: "full",
    remarks: "Not feeling well",
    status: "Pending",
    appliedOn: new Date("2023-10-25"),
  },
  {
    id: 3,
    employeeId: 3,
    leaveTypeId: 3,
    startDate: new Date("2023-12-20"),
    endDate: new Date("2023-12-31"),
    dayDuration: "full",
    remarks: "Year-end vacation",
    status: "Approved",
    appliedOn: new Date("2023-11-15"),
  },
  {
    id: 4,
    employeeId: 4,
    leaveTypeId: 1,
    startDate: new Date("2024-01-02"),
    endDate: new Date("2024-01-03"),
    dayDuration: "full",
    remarks: "Family function",
    status: "Rejected",
    appliedOn: new Date("2023-12-20"),
  },
  {
    id: 5,
    employeeId: 5,
    leaveTypeId: 2,
    startDate: new Date("2024-02-10"),
    endDate: new Date("2024-02-12"),
    dayDuration: "full",
    remarks: "Medical checkup",
    status: "Pending",
    appliedOn: new Date("2024-01-25"),
  },
]

const sampleManualEntries: ManualEntry[] = [
  {
    id: 1,
    employeeId: 1,
    date: new Date("2023-10-10"),
    inTime: "09:15",
    outTime: "18:00",
    remarks: "Forgot to punch in",
  },
  {
    id: 2,
    employeeId: 2,
    date: new Date("2023-10-12"),
    inTime: "09:00",
    outTime: "17:30",
    remarks: "System issue",
  },
  {
    id: 3,
    employeeId: 3,
    date: new Date("2023-10-15"),
    inTime: "09:30",
    outTime: "18:30",
    remarks: "Biometric not working",
  },
]

const sampleAttendances: Attendance[] = [
  {
    id: 1,
    employeeId: 1,
    date: new Date("2023-10-01"),
    inTime: "09:00",
    outTime: "18:00",
    status: "Present",
    lateMinutes: 0,
    earlyDepartureMinutes: 0,
    overtimeHours: 1,
  },
  {
    id: 2,
    employeeId: 2,
    date: new Date("2023-10-01"),
    inTime: "09:15",
    outTime: "17:45",
    status: "Present",
    lateMinutes: 15,
    earlyDepartureMinutes: 15,
    overtimeHours: 0,
  },
  {
    id: 3,
    employeeId: 3,
    date: new Date("2023-10-01"),
    inTime: "09:30",
    outTime: "18:30",
    status: "Present",
    lateMinutes: 30,
    earlyDepartureMinutes: 0,
    overtimeHours: 0.5,
  },
]

// Provider component
export const HRMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for all entities
  const [companies, setCompanies] = useState<Company[]>(sampleCompanies)
  const [departments, setDepartments] = useState<Department[]>(sampleDepartments)
  const [categories, setCategories] = useState<Category[]>(sampleCategories)
  const [designations, setDesignations] = useState<Designation[]>(sampleDesignations)
  const [shifts, setShifts] = useState<Shift[]>(sampleShifts)
  const [holidays, setHolidays] = useState<Holiday[]>(sampleHolidays)
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(sampleLeaveTypes)
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees)
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>(sampleLeaveApplications)
  const [manualEntries, setManualEntries] = useState<ManualEntry[]>(sampleManualEntries)
  const [attendances, setAttendances] = useState<Attendance[]>(sampleAttendances)

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadData = () => {
      try {
        const storedCompanies = localStorage.getItem("hrms_companies")
        if (storedCompanies) setCompanies(JSON.parse(storedCompanies))

        const storedDepartments = localStorage.getItem("hrms_departments")
        if (storedDepartments) setDepartments(JSON.parse(storedDepartments))

        const storedCategories = localStorage.getItem("hrms_categories")
        if (storedCategories) setCategories(JSON.parse(storedCategories))

        const storedDesignations = localStorage.getItem("hrms_designations")
        if (storedDesignations) setDesignations(JSON.parse(storedDesignations))

        const storedShifts = localStorage.getItem("hrms_shifts")
        if (storedShifts) setShifts(JSON.parse(storedShifts))

        const storedHolidays = localStorage.getItem("hrms_holidays")
        if (storedHolidays) {
          const parsedHolidays = JSON.parse(storedHolidays)
          // Convert date strings back to Date objects
          const formattedHolidays = parsedHolidays.map((h: any) => ({
            ...h,
            date: new Date(h.date),
          }))
          setHolidays(formattedHolidays)
        }

        const storedLeaveTypes = localStorage.getItem("hrms_leaveTypes")
        if (storedLeaveTypes) setLeaveTypes(JSON.parse(storedLeaveTypes))

        const storedEmployees = localStorage.getItem("hrms_employees")
        if (storedEmployees) {
          const parsedEmployees = JSON.parse(storedEmployees)
          // Convert date strings back to Date objects
          const formattedEmployees = parsedEmployees.map((e: any) => ({
            ...e,
            hireDate: new Date(e.hireDate),
            dob: e.dob ? new Date(e.dob) : undefined,
          }))
          setEmployees(formattedEmployees)
        }

        const storedLeaveApplications = localStorage.getItem("hrms_leaveApplications")
        if (storedLeaveApplications) {
          const parsedLeaveApplications = JSON.parse(storedLeaveApplications)
          // Convert date strings back to Date objects
          const formattedLeaveApplications = parsedLeaveApplications.map((la: any) => ({
            ...la,
            startDate: new Date(la.startDate),
            endDate: new Date(la.endDate),
            appliedOn: new Date(la.appliedOn),
          }))
          setLeaveApplications(formattedLeaveApplications)
        }

        const storedManualEntries = localStorage.getItem("hrms_manualEntries")
        if (storedManualEntries) {
          const parsedManualEntries = JSON.parse(storedManualEntries)
          // Convert date strings back to Date objects
          const formattedManualEntries = parsedManualEntries.map((me: any) => ({
            ...me,
            date: new Date(me.date),
          }))
          setManualEntries(formattedManualEntries)
        }

        const storedAttendances = localStorage.getItem("hrms_attendances")
        if (storedAttendances) {
          const parsedAttendances = JSON.parse(storedAttendances)
          // Convert date strings back to Date objects
          const formattedAttendances = parsedAttendances.map((a: any) => ({
            ...a,
            date: new Date(a.date),
          }))
          setAttendances(formattedAttendances)
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error)
      }
    }

    loadData()
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("hrms_companies", JSON.stringify(companies))
  }, [companies])

  useEffect(() => {
    localStorage.setItem("hrms_departments", JSON.stringify(departments))
  }, [departments])

  useEffect(() => {
    localStorage.setItem("hrms_categories", JSON.stringify(categories))
  }, [categories])

  useEffect(() => {
    localStorage.setItem("hrms_designations", JSON.stringify(designations))
  }, [designations])

  useEffect(() => {
    localStorage.setItem("hrms_shifts", JSON.stringify(shifts))
  }, [shifts])

  useEffect(() => {
    localStorage.setItem("hrms_holidays", JSON.stringify(holidays))
  }, [holidays])

  useEffect(() => {
    localStorage.setItem("hrms_leaveTypes", JSON.stringify(leaveTypes))
  }, [leaveTypes])

  useEffect(() => {
    localStorage.setItem("hrms_employees", JSON.stringify(employees))
  }, [employees])

  useEffect(() => {
    localStorage.setItem("hrms_leaveApplications", JSON.stringify(leaveApplications))
  }, [leaveApplications])

  useEffect(() => {
    localStorage.setItem("hrms_manualEntries", JSON.stringify(manualEntries))
  }, [manualEntries])

  useEffect(() => {
    localStorage.setItem("hrms_attendances", JSON.stringify(attendances))
  }, [attendances])

  // Helper functions
  const getNextId = (items: { id: number }[]) => {
    return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1
  }

  // CRUD operations for Company
  const addCompany = (company: Omit<Company, "id">) => {
    const newCompany = { ...company, id: getNextId(companies) }
    setCompanies([...companies, newCompany])
    toast({
      title: "Company Added",
      description: `${company.name} has been successfully added.`,
    })
  }

  const updateCompany = (id: number, company: Partial<Company>) => {
    setCompanies(
      companies.map((c) => {
        if (c.id === id) {
          return { ...c, ...company }
        }
        return c
      }),
    )
    toast({
      title: "Company Updated",
      description: `Company has been successfully updated.`,
    })
  }

  const deleteCompany = (id: number) => {
    // Check if company is referenced by departments
    const isReferenced = departments.some((d) => d.companyId === id)
    if (isReferenced) {
      toast({
        title: "Cannot Delete Company",
        description: "This company is referenced by one or more departments.",
        variant: "destructive",
      })
      return
    }

    const company = companies.find((c) => c.id === id)
    setCompanies(companies.filter((c) => c.id !== id))
    toast({
      title: "Company Deleted",
      description: `${company?.name} has been successfully deleted.`,
    })
  }

  // CRUD operations for Department
  const addDepartment = (department: Omit<Department, "id">) => {
    const newDepartment = { ...department, id: getNextId(departments) }
    setDepartments([...departments, newDepartment])
    toast({
      title: "Department Added",
      description: `${department.name} has been successfully added.`,
    })
  }

  const updateDepartment = (id: number, department: Partial<Department>) => {
    setDepartments(
      departments.map((d) => {
        if (d.id === id) {
          return { ...d, ...department }
        }
        return d
      }),
    )
    toast({
      title: "Department Updated",
      description: `Department has been successfully updated.`,
    })
  }

  const deleteDepartment = (id: number) => {
    // Check if department is referenced by designations or employees
    const isReferencedByDesignation = designations.some((d) => d.departmentId === id)
    const isReferencedByEmployee = employees.some((e) => e.departmentId === id)

    if (isReferencedByDesignation || isReferencedByEmployee) {
      toast({
        title: "Cannot Delete Department",
        description: "This department is referenced by designations or employees.",
        variant: "destructive",
      })
      return
    }

    const department = departments.find((d) => d.id === id)
    setDepartments(departments.filter((d) => d.id !== id))
    toast({
      title: "Department Deleted",
      description: `${department?.name} has been successfully deleted.`,
    })
  }

  // CRUD operations for Category
  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = { ...category, id: getNextId(categories) }
    setCategories([...categories, newCategory])
    toast({
      title: "Category Added",
      description: `${category.name} has been successfully added.`,
    })
  }

  const updateCategory = (id: number, category: Partial<Category>) => {
    setCategories(
      categories.map((c) => {
        if (c.id === id) {
          return { ...c, ...category }
        }
        return c
      }),
    )
    toast({
      title: "Category Updated",
      description: `Category has been successfully updated.`,
    })
  }

  const deleteCategory = (id: number) => {
    // Check if category is referenced by employees
    const isReferenced = employees.some((e) => e.categoryId === id)
    if (isReferenced) {
      toast({
        title: "Cannot Delete Category",
        description: "This category is referenced by one or more employees.",
        variant: "destructive",
      })
      return
    }

    const category = categories.find((c) => c.id === id)
    setCategories(categories.filter((c) => c.id !== id))
    toast({
      title: "Category Deleted",
      description: `${category?.name} has been successfully deleted.`,
    })
  }

  // CRUD operations for Designation
  const addDesignation = (designation: Omit<Designation, "id">) => {
    const newDesignation = { ...designation, id: getNextId(designations) }
    setDesignations([...designations, newDesignation])
    toast({
      title: "Designation Added",
      description: `${designation.name} has been successfully added.`,
    })
  }

  const updateDesignation = (id: number, designation: Partial<Designation>) => {
    setDesignations(
      designations.map((d) => {
        if (d.id === id) {
          return { ...d, ...designation }
        }
        return d
      }),
    )
    toast({
      title: "Designation Updated",
      description: `Designation has been successfully updated.`,
    })
  }

  const deleteDesignation = (id: number) => {
    // Check if designation is referenced by employees
    const isReferenced = employees.some((e) => e.designationId === id)
    if (isReferenced) {
      toast({
        title: "Cannot Delete Designation",
        description: "This designation is referenced by one or more employees.",
        variant: "destructive",
      })
      return
    }

    const designation = designations.find((d) => d.id === id)
    setDesignations(designations.filter((d) => d.id !== id))
    toast({
      title: "Designation Deleted",
      description: `${designation?.name} has been successfully deleted.`,
    })
  }

  // CRUD operations for Shift
  const addShift = (shift: Omit<Shift, "id">) => {
    const newShift = { ...shift, id: getNextId(shifts) }
    setShifts([...shifts, newShift])
    toast({
      title: "Shift Added",
      description: `${shift.name} has been successfully added.`,
    })
  }

  const updateShift = (id: number, shift: Partial<Shift>) => {
    setShifts(
      shifts.map((s) => {
        if (s.id === id) {
          return { ...s, ...shift }
        }
        return s
      }),
    )
    toast({
      title: "Shift Updated",
      description: `Shift has been successfully updated.`,
    })
  }

  const deleteShift = (id: number) => {
    // Check if shift is referenced by employees
    const isReferenced = employees.some((e) => e.shiftId === id)
    if (isReferenced) {
      toast({
        title: "Cannot Delete Shift",
        description: "This shift is referenced by one or more employees.",
        variant: "destructive",
      })
      return
    }

    const shift = shifts.find((s) => s.id === id)
    setShifts(shifts.filter((s) => s.id !== id))
    toast({
      title: "Shift Deleted",
      description: `${shift?.name} has been successfully deleted.`,
    })
  }

  // CRUD operations for Holiday
  const addHoliday = (holiday: Omit<Holiday, "id">) => {
    const newHoliday = { ...holiday, id: getNextId(holidays) }
    setHolidays([...holidays, newHoliday])
    toast({
      title: "Holiday Added",
      description: `${holiday.name} has been successfully added.`,
    })
  }

  const updateHoliday = (id: number, holiday: Partial<Holiday>) => {
    setHolidays(
      holidays.map((h) => {
        if (h.id === id) {
          return { ...h, ...holiday }
        }
        return h
      }),
    )
    toast({
      title: "Holiday Updated",
      description: `Holiday has been successfully updated.`,
    })
  }

  const deleteHoliday = (id: number) => {
    const holiday = holidays.find((h) => h.id === id)
    setHolidays(holidays.filter((h) => h.id !== id))
    toast({
      title: "Holiday Deleted",
      description: `${holiday?.name} has been successfully deleted.`,
    })
  }

  // CRUD operations for LeaveType
  const addLeaveType = (leaveType: Omit<LeaveType, "id">) => {
    const newLeaveType = { ...leaveType, id: getNextId(leaveTypes) }
    setLeaveTypes([...leaveTypes, newLeaveType])
    toast({
      title: "Leave Type Added",
      description: `${leaveType.name} has been successfully added.`,
    })
  }

  const updateLeaveType = (id: number, leaveType: Partial<LeaveType>) => {
    setLeaveTypes(
      leaveTypes.map((lt) => {
        if (lt.id === id) {
          return { ...lt, ...leaveType }
        }
        return lt
      }),
    )
    toast({
      title: "Leave Type Updated",
      description: `Leave type has been successfully updated.`,
    })
  }

  const deleteLeaveType = (id: number) => {
    // Check if leave type is referenced by leave applications
    const isReferenced = leaveApplications.some((la) => la.leaveTypeId === id)
    if (isReferenced) {
      toast({
        title: "Cannot Delete Leave Type",
        description: "This leave type is referenced by one or more leave applications.",
        variant: "destructive",
      })
      return
    }

    const leaveType = leaveTypes.find((lt) => lt.id === id)
    setLeaveTypes(leaveTypes.filter((lt) => lt.id !== id))
    toast({
      title: "Leave Type Deleted",
      description: `${leaveType?.name} has been successfully deleted.`,
    })
  }

  // CRUD operations for Employee
  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newEmployee = { ...employee, id: getNextId(employees) }
    setEmployees([...employees, newEmployee])
    toast({
      title: "Employee Added",
      description: `${employee.name} has been successfully added.`,
    })
  }

  const updateEmployee = (id: number, employee: Partial<Employee>) => {
    setEmployees(
      employees.map((e) => {
        if (e.id === id) {
          return { ...e, ...employee }
        }
        return e
      }),
    )
    toast({
      title: "Employee Updated",
      description: `Employee has been successfully updated.`,
    })
  }

  const deleteEmployee = (id: number) => {
    // Check if employee is referenced by leave applications or manual entries
    const isReferencedByLeaveApp = leaveApplications.some((la) => la.employeeId === id)
    const isReferencedByManualEntry = manualEntries.some((me) => me.employeeId === id)
    const isReferencedByAttendance = attendances.some((a) => a.employeeId === id)

    if (isReferencedByLeaveApp || isReferencedByManualEntry || isReferencedByAttendance) {
      toast({
        title: "Cannot Delete Employee",
        description: "This employee is referenced by leave applications, manual entries, or attendance records.",
        variant: "destructive",
      })
      return
    }

    const employee = employees.find((e) => e.id === id)
    setEmployees(employees.filter((e) => e.id !== id))
    toast({
      title: "Employee Deleted",
      description: `${employee?.name} has been successfully deleted.`,
    })
  }

  // CRUD operations for LeaveApplication
  const addLeaveApplication = (leaveApplication: Omit<LeaveApplication, "id" | "appliedOn" | "status">) => {
    const newLeaveApplication = {
      ...leaveApplication,
      id: getNextId(leaveApplications),
      appliedOn: new Date(),
      status: "Pending" as const,
    }
    setLeaveApplications([...leaveApplications, newLeaveApplication])
    toast({
      title: "Leave Application Submitted",
      description: `Your leave application has been submitted successfully.`,
    })
  }

  const updateLeaveApplication = (id: number, leaveApplication: Partial<LeaveApplication>) => {
    setLeaveApplications(
      leaveApplications.map((la) => {
        if (la.id === id) {
          return { ...la, ...leaveApplication }
        }
        return la
      }),
    )
    toast({
      title: "Leave Application Updated",
      description: `Leave application has been successfully updated.`,
    })
  }

  const deleteLeaveApplication = (id: number) => {
    setLeaveApplications(leaveApplications.filter((la) => la.id !== id))
    toast({
      title: "Leave Application Deleted",
      description: `Leave application has been successfully deleted.`,
    })
  }

  const approveLeaveApplication = (id: number) => {
    setLeaveApplications(
      leaveApplications.map((la) => {
        if (la.id === id) {
          return { ...la, status: "Approved" }
        }
        return la
      }),
    )
    toast({
      title: "Leave Application Approved",
      description: `Leave application has been approved.`,
    })
  }

  const rejectLeaveApplication = (id: number) => {
    setLeaveApplications(
      leaveApplications.map((la) => {
        if (la.id === id) {
          return { ...la, status: "Rejected" }
        }
        return la
      }),
    )
    toast({
      title: "Leave Application Rejected",
      description: `Leave application has been rejected.`,
    })
  }

  // CRUD operations for ManualEntry
  const addManualEntry = (manualEntry: Omit<ManualEntry, "id">) => {
    const newManualEntry = { ...manualEntry, id: getNextId(manualEntries) }
    setManualEntries([...manualEntries, newManualEntry])
    toast({
      title: "Manual Entry Added",
      description: `Manual entry has been successfully added.`,
    })
  }

  const updateManualEntry = (id: number, manualEntry: Partial<ManualEntry>) => {
    setManualEntries(
      manualEntries.map((me) => {
        if (me.id === id) {
          return { ...me, ...manualEntry }
        }
        return me
      }),
    )
    toast({
      title: "Manual Entry Updated",
      description: `Manual entry has been successfully updated.`,
    })
  }

  const deleteManualEntry = (id: number) => {
    setManualEntries(manualEntries.filter((me) => me.id !== id))
    toast({
      title: "Manual Entry Deleted",
      description: `Manual entry has been successfully deleted.`,
    })
  }

  // Helper functions to get entities by ID
  const getDepartmentById = (id: number) => departments.find((d) => d.id === id)
  const getCategoryById = (id: number) => categories.find((c) => c.id === id)
  const getDesignationById = (id: number) => designations.find((d) => d.id === id)
  const getShiftById = (id: number) => shifts.find((s) => s.id === id)
  const getEmployeeById = (id: number) => employees.find((e) => e.id === id)
  const getLeaveTypeById = (id: number) => leaveTypes.find((lt) => lt.id === id)
  const getCompanyById = (id: number) => companies.find((c) => c.id === id)

  return (
    <HRMSContext.Provider
      value={{
        // Data
        companies,
        departments,
        categories,
        designations,
        shifts,
        holidays,
        leaveTypes,
        employees,
        leaveApplications,
        manualEntries,
        attendances,

        // CRUD operations
        addCompany,
        updateCompany,
        deleteCompany,

        addDepartment,
        updateDepartment,
        deleteDepartment,

        addCategory,
        updateCategory,
        deleteCategory,

        addDesignation,
        updateDesignation,
        deleteDesignation,

        addShift,
        updateShift,
        deleteShift,

        addHoliday,
        updateHoliday,
        deleteHoliday,

        addLeaveType,
        updateLeaveType,
        deleteLeaveType,

        addEmployee,
        updateEmployee,
        deleteEmployee,

        addLeaveApplication,
        updateLeaveApplication,
        deleteLeaveApplication,
        approveLeaveApplication,
        rejectLeaveApplication,

        addManualEntry,
        updateManualEntry,
        deleteManualEntry,

        // Helper functions
        getDepartmentById,
        getCategoryById,
        getDesignationById,
        getShiftById,
        getEmployeeById,
        getLeaveTypeById,
        getCompanyById,
      }}
    >
      {children}
    </HRMSContext.Provider>
  )
}

// Custom hook to use the HRMS context
export const useHRMS = () => {
  const context = useContext(HRMSContext)
  if (context === undefined) {
    throw new Error("useHRMS must be used within a HRMSProvider")
  }
  return context
}
