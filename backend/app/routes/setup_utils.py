import pyrootutils

pyrootutils.setup_root(
    search_from=__file__,
    indicator=[
        "rootcheckpoint.yaml"
    ],  # Looks for these files to detect the root
    pythonpath=True,  # Adds the root to sys.path
    cwd=True,  # Changes the current working directory to root
)