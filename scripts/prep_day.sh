#!/bin/bash

echo "Creating files for" $1

mkdir src/$1
mkdir src/$1/__tests__
mkdir src/$1/data

touch src/$1/$1.ts  
echo "import * as fs from 'fs'

const data = fs.readFileSync('./src/${1}/data/data.txt').toString()
" > src/$1/$1.ts


touch src/$1/__tests__/$1.test.ts  
echo "describe('Dec ${1}', ()=> {
    describe('Part 1', ()=> {
        //
    })
    
    describe('Part 2', ()=>{
        //
    })
})" > src/$1/__tests__/$1.test.ts

touch src/$1/data/data.txt