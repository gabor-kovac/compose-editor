# compose-editor
Github Action to edit docker compose yaml files.

## Usage

To include the action in a workflow in another repository, you can use the
`uses` syntax with the `@` symbol to reference a specific branch, tag, or commit
hash.

See [action.yml](https://github.com/gabor-kovac/compose-editor/blob/main/action.yml)

**:warning: It is critical to escape yaml special characters when using inputs! Read more [here](https://www.w3schools.io/file/yaml-escape-characters/) :warning:**

The input '`value`' accepts JSON as well as [Hjson](https://hjson.github.io/syntax.html) formats

## Print service attribute value
`attribute` and `service` are optional, if both ommited, prints whole compose file
```yaml
  - name: Print service attribute value
    id: print-value
    uses: gabor-kovac/compose-editor@main
    with:
      inputFile: 'docker-compose.yml'
      command: 'print'
      service: 'mqtt'
      attribute: 'ports'
```

## Set value
```yaml
steps:
  - name: Edit compose
    id: edit-compose
    uses: gabor-kovac/compose-editor@main
    with:
      inputFile: 'docker-compose.yml'
      command: 'set'
      service: 'mqtt'
      attribute: 'links'
      value: "[\"service1\",\"service2\"]"
```

## Add value
```yaml
steps:
  - name: Edit compose
    id: edit-compose
    uses: gabor-kovac/compose-editor@main
    with:
      inputFile: 'docker-compose.yml'
      command: 'add'
      service: 'mqtt'
      attribute: 'links'
      value: "[\"service3\"]"
```

## Delete attribute
```yaml
steps:
  - name: Edit compose
    id: edit-compose
    uses: gabor-kovac/compose-editor@main
    with:
      inputFile: 'docker-compose.yml'
      command: 'delete'
      service: 'mqtt'
      attribute: 'links'
```

## Print json output
Use `<job-id>.outputs.print`
```yaml
  - name: Print Output
    id: output
    run: echo "${{ steps.edit-compose.outputs.print }}"
```

## Print yml output
Use `<job-id>.outputs.yml`
```yaml
  - name: Print yml Output
    id: yml
    run: echo "${{ steps.edit-compose.outputs.yml }}"
```

## Output to file
Use `outputFile` input to save edited file
```yaml
steps:
  - name: Edit compose
    id: edit-compose
    uses: gabor-kovac/compose-editor@main
    with:
      inputFile: 'docker-compose.yml'
      outputFile: 'docker-compose-edited.yml'
      command: 'set'
      service: 'mqtt'
      attribute: 'links'
      value: "[\"service1\",\"service2\"]"
```