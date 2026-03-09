#!/bin/bash

prefijo="MM"
contador=0
prev_familia=""

while IFS= read -r familia || [[ -n "$familia" ]]; do
  # Limpia espacios al inicio y fin
  familia=$(echo "$familia" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

  # Si la familia es diferente a la anterior, incrementa contador
  if [[ "$familia" != "$prev_familia" ]]; then
    contador=$((contador + 1))
    prev_familia="$familia"
  fi

  num_inv=$(printf "%s%03d" "$prefijo" "$contador")

  echo "$familia | $num_inv"
done
