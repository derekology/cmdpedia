from setuptools import setup, find_packages

README_PATH = "README.md"

with open(README_PATH, "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name='cmdpedia_generator',
    version='0.0.1-alpha1',
    packages=find_packages(),
    install_requires=[
        "click",
    ],
    entry_points={
        'console_scripts': [
            'cmdpedia_generator = cmdpedia_generator.__main__:main',
        ],
    },
    include_package_data=True,
    description='A tool for generating command documentation from Python CLI applications.',
    long_description=long_description,
    long_description_content_type="text/markdown",
    author='Derek Woo',
    author_email='me@derekw.co',
    url='https://github.com/derekology/cmdpedia-generator',
    classifiers=[
        'Programming Language :: Python :: 3',
        'Operating System :: OS Independent',
    ],
    python_requires='>=3.6'
)
