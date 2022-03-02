# EducaZika
An app to support teaching children with microcephaly due to the Zika virus disease

## Branch
This branch saves all diagrams relative to the project

### Structure
```
├── classes      // Class diagrams
├── database     // ER & other database diagrams
├── exported     // Diagrams as svg and png files
├── requirements // Requirements elicitation related
├── sequence     // Sequence & flowchart diagrams
└── use_cases    // Use cases
```
Each of these folders contains `.puml` files which are [plantuml](https://plantuml.com/) diagrams, and each of these diagrams are compiled and exported as `.svg` and `.png` into a folder named `exported` in the same path of the `.puml` file, but inside the folder.

__Example structure:__
```
├── classes
|   └── my_diagram.puml
└── exported
    └── classes
        ├── my_diagram.png
        └── my_diagram.svg
```