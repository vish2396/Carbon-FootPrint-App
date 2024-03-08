const CarbonFootprintCalculator = artifacts.require("CarbonFootprintCalculator");

contract("CarbonFootprintCalculator", (accounts) => {
    it("should calculate and store carbon footprint", async () => {
        const instance = await CarbonFootprintCalculator.deployed();

        const distance = 100;
        const fuelEfficiency = 10;

        await instance.calculateCarbonFootprint(distance, fuelEfficiency, { from: accounts[0] });

        const result = await instance.getCarbonFootprint.call({ from: accounts[0] });

        assert.equal(result, distance * fuelEfficiency / 100, "Incorrect carbon footprint");
    });

    it("should receive and store donations", async () => {
        const instance = await CarbonFootprintCalculator.deployed();

        const donationAmount = 100;

        await instance.donate({ from: accounts[0], value: donationAmount });

        const result = await instance.getDonation.call({ from: accounts[0] });

        assert.equal(result, donationAmount, "Incorrect donation amount");
    });
});
