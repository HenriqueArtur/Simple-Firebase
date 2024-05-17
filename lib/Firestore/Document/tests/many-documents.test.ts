import { describe, expect, it } from "vitest"

import {
  type $Pagination,
  defineDocumentsDiscovered,
  definePageByRule,
  definePagesDiscovered,
  type DocumentBuildRule,
  validateManySimpleDocuments
} from "../many-documents.js"
import { ManyDocumentsDefaultMock } from "../many-documents-mock.js"

describe("validateManySimpleDocuments", async () => {
  it("should throw an error if there are no previous documents and rule is 'PREVIOUS'", () => {
    const a_rule: DocumentBuildRule = "PREVIOUS"
    expect(() => {
      validateManySimpleDocuments(a_rule)
    }).toThrow("Not get previous page if first page")
  })

  it("should throw an error if the previous documents are on the first page and rule is 'PREVIOUS'", async () => {
    const a_rule: DocumentBuildRule = "PREVIOUS"
    const a_previous_many_docs = await ManyDocumentsDefaultMock()
    expect(() => {
      validateManySimpleDocuments(a_rule, a_previous_many_docs)
    }).toThrow("Not get previous page if first page")
  })

  it("should not throw an error if there are previous documents and rule is not 'PREVIOUS'", async () => {
    const a_rule: DocumentBuildRule = "NEXT"
    const a_previous_many_docs = await ManyDocumentsDefaultMock()
    expect(() => {
      validateManySimpleDocuments(a_rule, a_previous_many_docs)
    }).not.toThrow()
  })

  it("should not throw an error if the previous documents are not on the first page and rule is 'PREVIOUS'", async () => {
    const a_rule: DocumentBuildRule = "PREVIOUS"
    const a_previous_many_docs = await ManyDocumentsDefaultMock()
    const a_previous_many_docs_mock = {
      ...a_previous_many_docs,
      pagination: { page: 1, pages_discovered: 2, documents_discovered: 20 }
    }
    expect(() => {
      validateManySimpleDocuments(a_rule, a_previous_many_docs_mock)
    }).not.toThrow()
  })

  it("should not throw an error if there are no previous documents and rule is not 'PREVIOUS'", () => {
    const a_rule: DocumentBuildRule = "NEXT"
    expect(() => {
      validateManySimpleDocuments(a_rule)
    }).not.toThrow()
  })
})

describe("definePageByRule", () => {
  it("should return 0 if rule is 'DEFAULT'", () => {
    const a_rule: DocumentBuildRule = "DEFAULT"
    const result = definePageByRule(a_rule)
    expect(result).toBe(0)
  })

  it("should return 1 if rule is 'NEXT' and no previous page is provided", () => {
    const a_rule: DocumentBuildRule = "NEXT"
    const result = definePageByRule(a_rule)
    expect(result).toBe(1)
  })

  it("should return the next page number if rule is 'NEXT' and previous page is provided", () => {
    const a_rule: DocumentBuildRule = "NEXT"
    const a_previous_page = 2
    const result = definePageByRule(a_rule, a_previous_page)
    expect(result).toBe(3)
  })

  it("should return the previous page number if rule is 'PREVIOUS' and previous page is provided", () => {
    const a_rule: DocumentBuildRule = "PREVIOUS"
    const a_previous_page = 2
    const result = definePageByRule(a_rule, a_previous_page)
    expect(result).toBe(1)
  })

  it("should return 0 if rule is 'PREVIOUS' and no previous page is provided", () => {
    const a_rule: DocumentBuildRule = "PREVIOUS"
    const result = definePageByRule(a_rule)
    expect(result).toBe(0)
  })

  it("should return 0 if rule is 'PREVIOUS' and previous page is 0", () => {
    const a_rule: DocumentBuildRule = "PREVIOUS"
    const a_previous_page = 0
    const result = definePageByRule(a_rule, a_previous_page)
    expect(result).toBe(0)
  })
})

describe("definePagesDiscovered", () => {
  it("should return 1 if rule is 'DEFAULT'", () => {
    const a_rule: DocumentBuildRule = "DEFAULT"
    const result = definePagesDiscovered(a_rule, 0)
    expect(result).toBe(1)
  })

  it("should return the pages_discovered from previous pagination if rule is 'PREVIOUS'", () => {
    const a_rule: DocumentBuildRule = "PREVIOUS"
    const a_previous_pagination: $Pagination = {
      page: 1,
      pages_discovered: 5,
      documents_discovered: 50
    }
    const result = definePagesDiscovered(a_rule, 0, a_previous_pagination)
    expect(result).toBe(5)
  })

  it("should return the pages_discovered from previous pagination if rule is 'NEXT' and docs list is empty", () => {
    const a_rule: DocumentBuildRule = "NEXT"
    const a_previous_pagination: $Pagination = {
      page: 1,
      pages_discovered: 5,
      documents_discovered: 50
    }
    const result = definePagesDiscovered(a_rule, 0, a_previous_pagination)
    expect(result).toBe(5)
  })

  it("should return the incremented pages_discovered from previous pagination if rule is 'NEXT' and docs list is not empty", () => {
    const a_rule: DocumentBuildRule = "NEXT"
    const a_docs_list_size = 10
    const a_previous_pagination: $Pagination = {
      page: 1,
      pages_discovered: 5,
      documents_discovered: 50
    }
    const result = definePagesDiscovered(a_rule, a_docs_list_size, a_previous_pagination)
    expect(result).toBe(6)
  })
})

describe("defineDocumentsDiscovered", () => {
  it("should return the documents_discovered from previous pagination if rule is 'PREVIOUS'", () => {
    const a_rule: DocumentBuildRule = "PREVIOUS"
    const a_previous_pagination: $Pagination = { page: 1, pages_discovered: 5, documents_discovered: 50 }
    const result = defineDocumentsDiscovered(a_rule, 0, a_previous_pagination)
    expect(result).toBe(50)
  })

  it("should return the incremented documents_discovered from previous pagination if rule is 'NEXT'", () => {
    const a_rule: DocumentBuildRule = "NEXT"
    const a_docs_list_size = 10
    const a_previous_pagination: $Pagination = { page: 1, pages_discovered: 5, documents_discovered: 50 }
    const result = defineDocumentsDiscovered(a_rule, a_docs_list_size, a_previous_pagination)
    expect(result).toBe(60)
  })

  it("should return the documents_discovered equal to the document list size if rule is not 'PREVIOUS' or 'NEXT'", () => {
    const a_rule: DocumentBuildRule = "DEFAULT"
    const a_docs_list_size = 10
    const result = defineDocumentsDiscovered(a_rule, a_docs_list_size)
    expect(result).toBe(10)
  })
})
