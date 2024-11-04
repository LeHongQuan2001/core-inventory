import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdministratorPasswordService {

    lowerCase = true;
    upperCase = true;
    numbers = true;
    symbols = true;
    dictionary: string[] = [];
    chars = [
        "abcdefghijklmnopqrstuvwxyz",
        "ABCDEFGHIJKLMNOPWRSTUVWXYZ",
        "0123456789",
        "!@#$%^&*-"
    ];

    length = 15;

    constructor() {}

    public generate(n: any) {
        if (this.lowerCase === false && this.upperCase === false && this.numbers === false && this.symbols === false) {
            return "...";
        }

        this.length = typeof n !== 'undefined' ? n : this.length;
        this.dictionary = ([] as string[]).concat(
            this.lowerCase ? this.chars[0].split("") : [],
            this.upperCase ? this.chars[1].split("") : [],
            this.numbers ? this.chars[2].split("") : [],
            this.symbols ? this.chars[3].split("") : []
        );
        // Generate random password from array
        let newPassword = "";
        for (let i = 0; i < this.length; i++) {
            if (i < this.chars.length) {
                newPassword += this.chars[i].charAt(Math.floor(this.getRandomValue(this.chars[i].length)));
            } else {
                newPassword += this.dictionary[Math.floor(this.getRandomValue(this.dictionary.length))]
            }
        }

        return newPassword;
    }

    public checkStrength(p: any) {
        let force = 0;
        const regex = /[$-/:-?{-~!"^_@`\[\]]/g;

        const lowerLetters = /[a-z]+/.test(p);
        const upperLetters = /[A-Z]+/.test(p);
        const numbers = /[0-9]+/.test(p);
        const symbols = regex.test(p);

        const flags = [lowerLetters, upperLetters, numbers, symbols];

        let passedMatches = 0;
        for (const flag of flags) {
            passedMatches += flag === true ? 1 : 0;
        }

        force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
        force += passedMatches * 10;

        // short password
        force = (p.length <= 6) ? Math.min(force, 10) : force;

        // poor variety of characters
        force = (passedMatches === 1) ? Math.min(force, 10) : force;
        force = (passedMatches === 2) ? Math.min(force, 20) : force;
        force = (passedMatches === 3) ? Math.min(force, 30) : force;
        force = (passedMatches === 4) ? Math.min(force, 40) : force;

        return force;
    }

    getRandomValue(length: number) {
        const randomArray = new Uint32Array(1);
        window.crypto.getRandomValues(randomArray);
        const randomValue = randomArray[0] / (0xFFFFFFFF + 1);
        return Math.floor(randomValue * length);
    }
}
