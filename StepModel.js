var Step1Model = function () {
    var self = this;
    self.Email = '';
    self.FullName = '';
    self.Age = '';
    self.Address = '';
    self.Zip = '';
    self.City = '';
    self.Phone = '';
    self.Homepage = '';

    self.Initialized = false;
}

var Step2Model = function () {
    var self = this;
    self.WorkCurrent = '';
    self.WorkCurrentDescription = '';
    self.Experience = '';

    self.Initialized = false;
}

var Step3Model = function () {
    var self = this;
    self.Education = '';    
    self.PhotoExperience = '';

    self.Initialized = false;
}

var Step4Model = function () {
    var self = this;
    self.Swedish = '';
    self.Car = '';
    self.DriversLicense = '';
    self.CostumerExperience = '';
    self.YouthExperience = '';
    self.FileProfileImage = '';
    self.FilePersonalLetter = '';
    self.FileCv = '';
    self.PreferredWorkplaces = [];

    self.Initialized = false;
}
