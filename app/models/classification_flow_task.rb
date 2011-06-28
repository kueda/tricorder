class ClassificationFlowTask < FlowTask
  def run
    fasta_input = inputs.detect{|i| i.file_file_name =~ /.fasta/}
    abund_input = inputs.detect{|i| i.file_file_name =~ /.abund/}
    # run rdp classifier fasta
    # create an output for the rdp results
    # massage rdp results into json
    # massage abundances into json
  end
end
