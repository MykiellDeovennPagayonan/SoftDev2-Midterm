interface Community {
  getCommunityInfo() : string
  getLeaderInfo() : string
  setDescription(newDescription : string) : void
  updateHappinessIndex() : void
  addMembers(newMembers : Array<Member> | Member) : void
  changeLeaders(position : string) : string
  viewFacilities() : string
  addFacilities(newFacilities : Array<string>) : void
  holdEvent(event : Events) : string
  setCommunityGoal(newGoal : string) : void
}

// parent class
class DemocraticCommunity implements Community {
  private name : string
  private communityType : string
  private location : string
  protected leaders : Array<DemocraticLeader>
  protected members : Array<DemocraticMember>
  private population : number
  private area : number
  private description : string
  protected happinessIndex : number
  private communityGoal : string
  private facilities: Array<string>
  private events : Array<Events>

  constructor(name : string, location : string, leaders : Array<DemocraticLeader>, members : Array<DemocraticMember>, area : number, description : string, communityGoal : string, facilities : Array<string>) {
    this.name = name
    this.communityType = "democratic"
    this.location = location
    this.leaders = leaders
    this.members = members
    this.population = members.length + leaders.length
    this.area = area
    this.description = description

    let happiness : number = 0
    for (let i  = 0; i < members.length; i++) {
      happiness += members[i].getHappinessLevel()
    }
    for (let i  = 0; i < leaders.length; i++) {
      happiness += leaders[i].getHappinessLevel()
    }
    happiness /= (members.length + leaders.length)

    this.happinessIndex = happiness
    this.communityGoal = communityGoal
    this.facilities = facilities
    this.events = []
  }

  public getCommunityInfo() : string {
    return `${this.name} is a ${this.communityType} community with a population of ${this.population} whose goal is to ${this.communityGoal}. It is located at ${this.location} and has an area of ${this.area} sq. kilometers. It has a happiness index of ${this.happinessIndex}. ${this.description}`
  }

  public getLeaderInfo() : string {
    let leadersNames : string = ""
    for (let i = 0; i < this.leaders.length; i++) {
      leadersNames += this.leaders[i].getName()
      if (i < this.leaders.length - 1) {
        leadersNames += ", "
      }
    }
    
    if (this.leaders.length > 1) {
      return `The Leaders of the city are ${leadersNames}.`
    } else {
      return `The Leader of the city is ${leadersNames}.`
    }
  }

  public setDescription(newDescription : string) : void {
    this.description = newDescription
  }

  public updateHappinessIndex() : void {
    let happiness : number = 0
    for (let i  = 0; i < this.members.length; i++) {
      happiness += this.members[i].getHappinessLevel()
    }
    for (let i  = 0; i < this.leaders.length; i++) {
      happiness += this.leaders[i].getHappinessLevel()
    }
    happiness /= (this.members.length + this.leaders.length)

    this.happinessIndex = happiness
  }

  public addMembers(newMembers : Array<DemocraticMember> | DemocraticMember) : void {
    if (Array.isArray(newMembers)) {
      for (let i = 0; i < newMembers.length; i++) {
        this.members.push(newMembers[i])
      }
    } else {
      this.members.push(newMembers)
    }

    this.population = this.members.length
  }

  public changeLeaders(position : string) : string {
    let runningForPosition : Array<Candidate> = []
    for (let i = 0; i < this.leaders.length; i++) {
      if (this.leaders[i].getPosition() === position) {
        let candidate : Candidate = new Candidate(this.leaders[i].getName())
        runningForPosition.push(candidate)
      }
    }

    if (runningForPosition.length === 0) {
      return `No one is running for ${position}`
    } else if (runningForPosition.length === 1) {
      return `${runningForPosition[0].getName()} is the new ${position}!`
    }

    for (let i = 0; i < runningForPosition.length; i++) {
      for (let j = 0; j < this.members.length; j++) {
        if (this.members[j].getLeaderPreference() === runningForPosition[i].getName()){
          runningForPosition[i].addVote()
        }
      }
    }

    let highestVotes = 0;
    let winningCandidate : Candidate = runningForPosition[0];
    for (let i = 0; i < runningForPosition.length; i++) {
      if (runningForPosition[i].getVotes() > highestVotes) {
        highestVotes = runningForPosition[i].getVotes();
        winningCandidate = runningForPosition[i];
      }
    }
  
    return `${winningCandidate.getName()} is the new ${position}!`;
  }

  public viewFacilities() : string {
    let facilitiesList: string = "";
    for (let i = 0; i < this.facilities.length; i++) {
      facilitiesList += this.facilities[i];
      if (i < this.facilities.length - 1) {
        facilitiesList += ", ";
      }
    }

    if (this.facilities.length > 0) {
      return `The community has the following facilities: ${facilitiesList}.`;
    } else {
      return "The community currently has no facilities.";
    }
  }

  public addFacilities(newFacilities : Array<string>) : void {
    for (let i = 0; i < newFacilities.length; i++) {
      this.facilities.push(newFacilities[i])
    }
  }

  public holdEvent(event : Events) : string {
    const happinessImpact = event.getHappinessimpact()

    for (let i = 0; i < this.members.length; i++) {
      this.members[i].setHappinessLevel(this.members[i].getHappinessLevel() + happinessImpact)
    }
    for (let i = 0; i < this.leaders.length; i++) {
      this.leaders[i].setHappinessLevel(this.leaders[i].getHappinessLevel() + happinessImpact)
    }

    this.events.push(event)
    this.updateHappinessIndex()

    return `${event.getName()} was held! it raised everyone's happiness by ${happinessImpact}!!`
  }

  public setCommunityGoal(newGoal : string) : void {
    this.communityGoal = newGoal;
  }
}

// child class 1 (by Pagayonan)
class City extends DemocraticCommunity {
  private crimeRatePerYear : number
  private GDP : number
  private majorIndustries : Array<string>
  private transportation: Array<string>
  private culturalAttractions: Array<string>
  private touristAttractions: Array<string>
  private climate : string

  constructor (name : string, location : string, leaders : Array<DemocraticLeader>, members : Array<DemocraticMember>, area : number, description : string, communityGoal : string, facilities : Array<string>, policies : Array<string>, crimeRateIndex : number, GDP : number, majorIndustries : Array<string>, transportation: Array<string>, culturalAttractions: Array<string>, touristAttractions: Array<string>, climate : string) {
    super(name, location, leaders, members, area, description, communityGoal, facilities)
    let updatedCrimeRate = crimeRateIndex
    if (facilities.includes("Police")) {
      updatedCrimeRate *= 0.9
    }
    if (facilities.includes("SWAT")) {
      updatedCrimeRate *= 0.9
    }
    if (facilities.includes("CCTV Cameras")) {
      updatedCrimeRate *= 0.95
    }

    this.crimeRatePerYear = updatedCrimeRate
    this.GDP = GDP
    this.majorIndustries = majorIndustries
    this.transportation = transportation
    this.culturalAttractions = culturalAttractions
    this.touristAttractions = touristAttractions
    this.climate = climate
  }

  // overriding a method
  public getCommunityInfo() : string {
    const originalInfo = super.getCommunityInfo()

    let majorIndustriesList : string = ""
    for (let i = 0; i < this.majorIndustries.length; i++) {
      majorIndustriesList += this.majorIndustries[i]
      if (i < this.majorIndustries.length - 1) {
        majorIndustriesList += ", "
      }
    }

    let transportationList : string = ""
    for (let i = 0; i < this.transportation.length; i++) {
      transportationList += this.transportation[i]
      if (i < this.transportation.length - 1) {
        transportationList += ", "
      }
    }

    let culturalAttractionsList : string = ""
    for (let i = 0; i < this.culturalAttractions.length; i++) {
      culturalAttractionsList += this.culturalAttractions[i]
      if (i < this.culturalAttractions.length - 1) {
        culturalAttractionsList += ", "
      }
    }

    let touristAttractionsList : string = ""
    for (let i = 0; i < this.touristAttractions.length; i++) {
      touristAttractionsList += this.touristAttractions[i]
      if (i < this.touristAttractions.length - 1) {
        touristAttractionsList += ", "
      }
    }

    const newInfo = `${originalInfo}. People get around the city through ${transportationList}. Its industries are composed of ${majorIndustriesList}. People are attracted to come to this place because of it ${culturalAttractionsList} ${touristAttractionsList}`

    return newInfo
  }

  // overloading a method
  public updateHappinessIndex(reason? : string) : void {
    let happiness : number = 0
    for (let i  = 0; i < this.members.length; i++) {
      happiness += this.members[i].getHappinessLevel()
    }
    for (let i  = 0; i < this.leaders.length; i++) {
      happiness += this.leaders[i].getHappinessLevel()
    }
    happiness /= (this.members.length + this.leaders.length)
    let oldHappinessIndex = this.happinessIndex

    if (oldHappinessIndex > happiness) {
      if (reason !== undefined) {
        console.log(`people became less happy because of ${reason}.`)
      } else {
        console.log(`people became less happy.`)
      } 
    } else if (oldHappinessIndex > happiness) {
      if (reason !== undefined) {
        console.log(`people became more happy because of ${reason}.`)
      } else {
        console.log(`people became more happy.`)
      } 
    } else {
      if (reason !== undefined) {
        console.log(`people are just as happy even with ${reason}.`)
      } else {
        console.log(`people are just as happy.`)
      } 
    }

    this.happinessIndex = happiness
  }

  getCrimeRatePerYear(): number {
    return this.crimeRatePerYear
  }

  getGDP(): number {
    return this.GDP
  }

  getMajorIndustries(): Array<string> {
    return this.majorIndustries
  }

  getTransportation(): Array<string> {
    return this.transportation
  }

  getCulturalAttractions(): Array<string> {
    return this.culturalAttractions
  }

  getTouristAttractions(): Array<string> {
    return this.touristAttractions
  }

  getClimate(): string {
    return this.climate
  }

  addMajorIndustry(industry: string): void {
    this.majorIndustries.push(industry)
    this.GDP *= 1.1
  }

  addTransportation(transportation: string): void {
    this.transportation.push(transportation)
    this.GDP *= 1.1
  }

  addCulturalAttractions(culturalAttraction: string): void {
    this.culturalAttractions.push(culturalAttraction)
    this.GDP *= 1.05
    const openingEvent = new Events(`Opening of ${culturalAttraction}`, 5)
    this.holdEvent(openingEvent)
  }

  addTouristAttractions(touristAttraction: string): void {
    this.touristAttractions.push(touristAttraction)
    this.GDP *= 1.05
    const openingEvent = new Events(`Opening of ${touristAttraction}`, 5)
    this.holdEvent(openingEvent)
  }


}

// extra stuff
class Member {
  private name: string
  private happinessLevel: number
  private occupation: string

  constructor(name : string, occupation : string) {
    this.name = name
    this.happinessLevel = 50
    this.occupation = occupation
  }

  public getHappinessLevel(): number {
    return this.happinessLevel
  }

  public setHappinessLevel(level: number): void {
    this.happinessLevel = level
  }

  public getOccupation(): string {
    return this.occupation
  }

  public setOccupation(occupation: string): void {
    this.occupation = occupation
  }

  public getName(): string {
    return this.name
  }
}

class DemocraticMember extends Member {
  private leaderPreference: string

  constructor(name : string, occupation : string, leaderPreference: string) {
    super(name, occupation)
    this.leaderPreference = leaderPreference
  }

  public setLeaderPreference(preference: string): void {
    this.leaderPreference = preference
  }

  public getLeaderPreference(): string {
    return this.leaderPreference
  }
}

class DemocraticLeader extends Member {
  private position: string

  constructor(name: string, position: string) {
    super(name, "politician")
    this.position = position
  }

  public getPosition(): string {
    return this.position
  }

  public setPosition(position: string): void {
    this.position = position
  }
}

class Events {
  private name : string
  private happinessImpact : number

  constructor(name : string, happinessImpact : number) {
    this.name = name
    this.happinessImpact = happinessImpact
  }

  public getName() : string {
    return this.name
  }

  public setName(newName : string) : void {
    this.name = newName
  }

  public getHappinessimpact() : number {
    return this.happinessImpact
  }

  public setHappinessimpact(newHappinessImpact : number) : void {
    this.happinessImpact = newHappinessImpact
  }
}

class Candidate {
  private name : string
  private votes : number
  constructor(name) {
    this.name = name
  }

  public getName() : string {
    return this.name
  }

  public getVotes() : number {
    return this.votes
  }

  public addVote() : void {
    this.votes++
  }
}

let leader1 = new DemocraticLeader("Johnny", "Councilor")
let leader2 = new DemocraticLeader("Daniel", "Councilor")
let leader3 = new DemocraticLeader("David", "Councilor")

let leaders : Array<DemocraticLeader> = [leader1, leader2, leader3]

let member1 = new DemocraticMember("Deobrah", "Teacher", "Johnny")
let member2 = new DemocraticMember("Indigo", "Electrician", "Daniel")
let member3 = new DemocraticMember("Nova", "Chef", "Johnny")
let member4 = new DemocraticMember("Sage", "Accountant", "Daniel")
let member5 = new DemocraticMember("Ember", "engineer", "Daniel")
let member6 = new DemocraticMember("Orion", "Writer", "David")
let member7 = new DemocraticMember("Luna", "Graphic Designer", "David")

let members : Array<DemocraticMember> = [member1, member2, member3, member4, member5, member6, member7]



let city = new City("Tbilisi", "Luminaria Island", leaders, members, 447, "A peaceful city from the unknown living peacefully in secrecy", "To build and live quiety", ["Firestation", "Police"], ["Equal Opportunity and Diversity Policy", "Community-Based Sustainable Development Policy"], 59, 300245, ["Powerplant"], ["Bus", "train"], ["The Great Statue"], ["Closing Cliffs"], "temperate")
console.log(city.getCommunityInfo())
console.log(city.getGDP())

let randomEvent = new Events("hunting woods", 3)
console.log(city.holdEvent(randomEvent))
city.updateHappinessIndex("there is a new kitten celebrity")
console.log(city.changeLeaders("Mayor"))
console.log(city.getCrimeRatePerYear())
city.addFacilities(["improved water system"])
city.addMajorIndustry("Mine")
console.log(city.getMajorIndustries())